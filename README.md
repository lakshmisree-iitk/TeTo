# TeTo - Online Learning Platform

A comprehensive online learning platform with video streaming, reading material management, and AI-powered chatbot assistance.

## Features

- **Video Streaming**: Upload and stream teacher videos with high-quality playback
- **Reading Materials**: Upload and manage PDFs, documents, and study materials
- **AI Chatbot**: Get instant answers from uploaded materials and web sources
- **Modern UI**: Beautiful, responsive interface with smooth animations
- **File Processing**: Automatic text extraction from PDFs and documents for AI processing

## Tech Stack

### Backend
- Node.js with Express
- Multer for file uploads
- Google Gemini AI for chatbot
- Web scraping for real-time information
- PDF and document parsing

### Frontend
- React with modern hooks
- Tailwind CSS for styling
- Framer Motion for animations
- React Router for navigation
- Axios for API communication

## Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Google Gemini API key

### Installation

1. **Clone and navigate to the project**
   ```bash
   cd TeTo
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   ```
   Edit `.env` and add your Google Gemini API key:
   ```
   GEMINI_API_KEY=your_actual_gemini_api_key_here
   ```

4. **Start the development servers**
   ```bash
   npm run dev
   ```

This will start both the backend server (port 5000) and frontend development server (port 3000).

## Usage

### For Teachers/Administrators

1. **Upload Videos**: Go to the Upload page and select "Video" to upload lecture videos
2. **Upload Materials**: Select "Reading Material" to upload PDFs, documents, and study materials
3. **Monitor Content**: View uploaded content in the respective sections

### For Students

1. **Watch Videos**: Navigate to the Videos section to stream uploaded lectures
2. **Access Materials**: Download reading materials from the Materials section
3. **Ask Questions**: Use the AI Chatbot to get help with any topic or uploaded content

## API Endpoints

### File Management
- `POST /api/upload/video` - Upload video files
- `POST /api/upload/material` - Upload reading materials
- `GET /api/videos/:filename` - Stream video files
- `GET /api/materials/:filename` - Download material files
- `GET /api/files` - Get list of uploaded files

### AI Chatbot
- `POST /api/chat` - Send messages to AI assistant

### Health Check
- `GET /api/health` - Server status

## File Support

### Videos
- MP4, AVI, MOV, WMV, FLV, WebM
- Maximum size: 100MB

### Reading Materials
- PDF, DOC, DOCX, TXT, RTF
- Maximum size: 100MB
- Text extraction for AI processing

## AI Features

The chatbot can:
- Answer questions about uploaded materials
- Search the web for current information
- Provide citations and sources
- Combine information from multiple sources
- Give educational explanations

## Development

### Project Structure
```
TeTo/
├── server/           # Backend Express server
│   └── index.js     # Main server file
├── client/          # React frontend
│   ├── src/
│   │   ├── components/  # React components
│   │   └── App.js       # Main app component
│   └── package.json
├── uploads/         # Uploaded files (created automatically)
│   ├── videos/      # Video files
│   └── materials/   # Reading materials
└── package.json     # Root package.json
```

### Available Scripts
- `npm run dev` - Start both servers in development
- `npm run server` - Start backend server only
- `npm run client` - Start frontend server only
- `npm run build` - Build frontend for production
- `npm start` - Start production server

## Configuration

### Environment Variables
- `GEMINI_API_KEY` - Required for AI chatbot functionality
- `PORT` - Server port (default: 5000)

### Customization
- Modify `server/index.js` for backend changes
- Edit `client/src/components/` for UI changes
- Update `client/tailwind.config.js` for styling

## Security Notes

- File uploads are validated for type and size
- Videos are streamed with proper headers
- API endpoints include error handling
- CORS is configured for development

## Troubleshooting

### Common Issues

1. **Gemini API Error**: Ensure your API key is correct and has sufficient quota
2. **File Upload Fails**: Check file size (max 100MB) and format
3. **Video Not Playing**: Ensure video format is supported by the browser
4. **Port Conflicts**: Change PORT in .env if 5000 is in use

### Getting Help

1. Check the browser console for frontend errors
2. Monitor server logs for backend issues
3. Verify all dependencies are installed
4. Ensure environment variables are set correctly

## License

MIT License - see LICENSE file for details.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

**TeTo** - Empowering education through technology and AI.
