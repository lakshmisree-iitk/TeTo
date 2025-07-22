const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs-extra');
const { v4: uuidv4 } = require('uuid');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const axios = require('axios');
const cheerio = require('cheerio');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Initialize Google Generative AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// File storage setup
const uploadsDir = path.join(__dirname, '../uploads');
const videosDir = path.join(uploadsDir, 'videos');
const materialsDir = path.join(uploadsDir, 'materials');

// Ensure directories exist
fs.ensureDirSync(uploadsDir);
fs.ensureDirSync(videosDir);
fs.ensureDirSync(materialsDir);

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === 'video') {
      cb(null, videosDir);
    } else {
      cb(null, materialsDir);
    }
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.fieldname === 'video') {
      // Allow video files
      const allowedTypes = /mp4|avi|mov|wmv|flv|webm/;
      const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
      const mimetype = allowedTypes.test(file.mimetype);
      if (mimetype && extname) {
        return cb(null, true);
      } else {
        cb(new Error('Only video files are allowed!'));
      }
    } else {
      // Allow document files
      const allowedTypes = /pdf|doc|docx|txt|rtf/;
      const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
      if (extname) {
        return cb(null, true);
      } else {
        cb(new Error('Only PDF, DOC, DOCX, TXT, and RTF files are allowed!'));
      }
    }
  },
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB limit
  }
});

// Store uploaded materials content for AI processing
let materialsContent = [];

// Load existing materials on startup
async function loadExistingMaterials() {
  try {
    const materials = fs.readdirSync(materialsDir);
    for (const filename of materials) {
      const filePath = path.join(materialsDir, filename);
      const fileExt = path.extname(filename).toLowerCase();
      
      let content = '';
      if (fileExt === '.pdf') {
        const dataBuffer = fs.readFileSync(filePath);
        const data = await pdfParse(dataBuffer);
        content = data.text;
      } else if (fileExt === '.docx') {
        const result = await mammoth.extractRawText({ path: filePath });
        content = result.value;
      } else if (fileExt === '.txt' || fileExt === '.rtf') {
        content = fs.readFileSync(filePath, 'utf8');
      } else if (fileExt === '.doc') {
        content = `Document file: ${filename}`;
      }
      
      if (content) {
        materialsContent.push({
          filename: filename,
          content: content
        });
      }
    }
    console.log(`Loaded ${materialsContent.length} existing materials`);
  } catch (error) {
    console.error('Error loading existing materials:', error);
  }
}

// Routes

// Upload video
app.post('/api/upload/video', upload.single('video'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No video file uploaded' });
    }

    const videoInfo = {
      id: uuidv4(),
      filename: req.file.filename,
      originalName: req.file.originalname,
      path: req.file.path,
      size: req.file.size,
      uploadDate: new Date().toISOString(),
      url: `/api/videos/${req.file.filename}`
    };

    res.json({
      message: 'Video uploaded successfully',
      video: videoInfo
    });
  } catch (error) {
    console.error('Video upload error:', error);
    res.status(500).json({ error: 'Failed to upload video' });
  }
});

// Upload reading material
app.post('/api/upload/material', upload.single('material'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No material file uploaded' });
    }

    let content = '';
    const filePath = req.file.path;
    const fileExt = path.extname(req.file.originalname).toLowerCase();

    // Extract text content based on file type
    try {
      if (fileExt === '.pdf') {
        const dataBuffer = fs.readFileSync(filePath);
        const data = await pdfParse(dataBuffer);
        content = data.text;
      } else if (fileExt === '.docx') {
        const result = await mammoth.extractRawText({ path: filePath });
        content = result.value;
      } else if (fileExt === '.txt' || fileExt === '.rtf') {
        content = fs.readFileSync(filePath, 'utf8');
      } else if (fileExt === '.doc') {
        // For .doc files, we'll store the file path for now
        content = `Document file: ${req.file.originalname}`;
      }

      const materialInfo = {
        id: uuidv4(),
        filename: req.file.filename,
        originalName: req.file.originalname,
        path: req.file.path,
        size: req.file.size,
        uploadDate: new Date().toISOString(),
        content: content,
        url: `/api/materials/${req.file.filename}`
      };

      // Store content for AI processing
      materialsContent.push({
        filename: req.file.originalname,
        content: content
      });

      res.json({
        message: 'Material uploaded successfully',
        material: materialInfo
      });
    } catch (parseError) {
      console.error('Error parsing file:', parseError);
      res.status(500).json({ error: 'Failed to parse uploaded file' });
    }
  } catch (error) {
    console.error('Material upload error:', error);
    res.status(500).json({ error: 'Failed to upload material' });
  }
});

// Stream video
app.get('/api/videos/:filename', (req, res) => {
  const videoPath = path.join(videosDir, req.params.filename);
  
  if (!fs.existsSync(videoPath)) {
    return res.status(404).json({ error: 'Video not found' });
  }

  const stat = fs.statSync(videoPath);
  const fileSize = stat.size;
  const range = req.headers.range;

  if (range) {
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
    const chunksize = (end - start) + 1;
    const file = fs.createReadStream(videoPath, { start, end });
    const head = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': 'video/mp4',
    };
    res.writeHead(206, head);
    file.pipe(res);
  } else {
    const head = {
      'Content-Length': fileSize,
      'Content-Type': 'video/mp4',
    };
    res.writeHead(200, head);
    fs.createReadStream(videoPath).pipe(res);
  }
});

// Serve materials
app.get('/api/materials/:filename', (req, res) => {
  const materialPath = path.join(materialsDir, req.params.filename);
  
  if (!fs.existsSync(materialPath)) {
    return res.status(404).json({ error: 'Material not found' });
  }

  res.download(materialPath);
});

// Get uploaded files list
app.get('/api/files', (req, res) => {
  try {
    const videos = fs.readdirSync(videosDir).map(filename => ({
      type: 'video',
      filename,
      url: `/api/videos/${filename}`
    }));

    const materials = fs.readdirSync(materialsDir).map(filename => ({
      type: 'material',
      filename,
      url: `/api/materials/${filename}`
    }));

    res.json({
      videos,
      materials
    });
  } catch (error) {
    console.error('Error getting files:', error);
    res.status(500).json({ error: 'Failed to get files' });
  }
});

// Web search function
async function searchWeb(query) {
  try {
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
    const response = await axios.get(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    const $ = cheerio.load(response.data);
    const results = [];

    // Extract search results
    $('.g').each((i, element) => {
      const title = $(element).find('h3').text();
      const snippet = $(element).find('.VwiC3b').text();
      const link = $(element).find('a').attr('href');

      if (title && snippet && link) {
        results.push({
          title,
          snippet,
          link: link.startsWith('/url?q=') ? link.substring(7).split('&')[0] : link
        });
      }
    });

    return results.slice(0, 5); // Return top 5 results
  } catch (error) {
    console.error('Web search error:', error);
    return [];
  }
}

// AI Chatbot endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Search the web for relevant information
    const webResults = await searchWeb(message);
    
    // Prepare context from uploaded materials
    const materialsContext = materialsContent.length > 0 
      ? `\n\nUploaded Materials Context:\n${materialsContent.map(m => `${m.filename}:\n${m.content.substring(0, 1000)}...`).join('\n\n')}`
      : '';

    // Prepare web search context
    const webContext = webResults.length > 0 
      ? `\n\nWeb Search Results:\n${webResults.map(r => `${r.title}:\n${r.snippet}\nSource: ${r.link}`).join('\n\n')}`
      : '';

    // Create the full context for the AI
    const fullContext = `You are a helpful educational assistant. Answer the student's question based on the following information:

${materialsContext}
${webContext}

Student Question: ${message}

IMPORTANT INSTRUCTIONS:
1. ALWAYS answer the question FIRST using the uploaded materials if available and relevant
2. If you use information from uploaded materials, cite the filename like this: "According to [filename]: [quote or paraphrase]"
3. After addressing the question with uploaded materials, you can provide additional information from your knowledge
4. If you use web search results, include the exact URL as a hyperlink: "[Title](URL)"
5. Be educational, clear, and comprehensive
6. Always mention which materials you referenced in your response

Answer:`;

    // Use Gemini API
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const result = await model.generateContent(fullContext);
    const aiResponse = result.response.text();

    res.json({
      response: aiResponse,
      sources: webResults.map(r => ({ title: r.title, url: r.link })),
      materialsUsed: materialsContent.length > 0 ? materialsContent.map(m => m.filename) : []
    });

  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ 
      error: 'Failed to process chat request',
      details: error.message 
    });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Upload directories created: ${uploadsDir}`);
  await loadExistingMaterials();
}); 