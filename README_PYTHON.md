# TeTo Learning Platform - Python FastAPI Version

A modern online learning platform built with FastAPI (Python) and React, featuring video streaming, reading material uploads, and an AI chatbot powered by Google's Gemini API.

## Features

- **Video Upload & Streaming**: Upload and stream educational videos with range request support
- **Reading Material Upload**: Upload PDF, DOC, DOCX, TXT, and RTF files
- **AI Chatbot**: Powered by Google Gemini API with context from uploaded materials
- **Web Search Integration**: Combines uploaded materials with web search results
- **Modern API**: FastAPI with automatic OpenAPI documentation
- **Real-time File Processing**: Async file handling and text extraction
- **CORS Support**: Configured for React frontend integration

## Technology Stack

### Backend (Python)
- **FastAPI**: Modern, fast web framework for building APIs
- **Uvicorn**: ASGI server for running FastAPI
- **Google Generative AI**: For AI chatbot functionality
- **PyPDF2**: PDF text extraction
- **python-docx**: DOCX file processing
- **aiohttp**: Async HTTP client for web search
- **BeautifulSoup4**: Web scraping for search results

### Frontend (React)
- React with modern hooks
- File upload components
- Video player
- Chat interface
- Material viewer

## Quick Start

### Prerequisites
- Python 3.8 or higher
- Node.js 16 or higher
- Google Gemini API key

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd TeTo
   ```

2. **Set up Python environment**
   ```bash
   # Run the Python setup script
   ./setup_python.sh
   
   # Or manually:
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   ```

3. **Set up frontend**
   ```bash
   cd client
   npm install
   cd ..
   ```

4. **Configure environment variables**
   ```bash
   cp env.example .env
   # Edit .env and add your GEMINI_API_KEY
   ```

5. **Start the servers**

   **Option 1: Using npm scripts**
   ```bash
   # Start Python backend
   npm run server:python
   
   # In another terminal, start React frontend
   npm run client
   ```

   **Option 2: Manual startup**
   ```bash
   # Start Python backend
   source venv/bin/activate
   python start_server.py
   
   # In another terminal, start React frontend
   cd client && npm start
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5001
   - API Documentation: http://localhost:5001/docs

## API Endpoints

### File Upload
- `POST /api/upload/video` - Upload video files
- `POST /api/upload/material` - Upload reading materials

### File Serving
- `GET /api/videos/{filename}` - Stream video with range support
- `GET /api/materials/{filename}` - Download materials
- `GET /api/files` - List all uploaded files

### AI Chatbot
- `POST /api/chat` - Send messages to AI chatbot

### Health Check
- `GET /api/health` - Server health status

## File Support

### Videos
- MP4, AVI, MOV, WMV, FLV, WebM
- Up to 100MB per file
- Streaming with range request support

### Reading Materials
- PDF, DOC, DOCX, TXT, RTF
- Automatic text extraction for AI processing
- Up to 100MB per file

## AI Chatbot Features

- **Context-Aware**: Uses uploaded materials as primary source
- **Web Search Integration**: Combines with web search results
- **Citation Support**: Cites specific materials and web sources
- **Educational Focus**: Tailored for learning environments

## Development

### Running in Development Mode
```bash
# Backend with auto-reload
python start_server.py

# Frontend with hot reload
cd client && npm start
```

### API Documentation
FastAPI automatically generates interactive API documentation:
- Swagger UI: http://localhost:5001/docs
- ReDoc: http://localhost:5001/redoc

### Environment Variables
```bash
# Required
GEMINI_API_KEY=your_gemini_api_key_here

# Optional
PORT=5001
```

## Deployment

### Production Setup
1. Install production dependencies
2. Set up environment variables
3. Use production ASGI server (Gunicorn + Uvicorn)
4. Configure reverse proxy (Nginx)
5. Set up SSL certificates

### Docker Support
```dockerfile
# Example Dockerfile for Python backend
FROM python:3.11-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
EXPOSE 5001

CMD ["python", "start_server.py"]
```

## Troubleshooting

### Common Issues

1. **API Key Issues**
   - Ensure GEMINI_API_KEY is set in .env
   - Verify the API key is valid and has proper permissions

2. **Port Conflicts**
   - Check if port 5001 is available
   - Kill existing processes: `lsof -ti:5001 | xargs kill -9`

3. **File Upload Issues**
   - Check file size limits (100MB)
   - Verify file extensions are supported
   - Ensure upload directories have write permissions

4. **Python Dependencies**
   - Activate virtual environment: `source venv/bin/activate`
   - Reinstall dependencies: `pip install -r requirements.txt`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Support

For issues and questions:
1. Check the troubleshooting section
2. Review API documentation at `/docs`
3. Check server logs for error details
4. Open an issue on GitHub 