#!/usr/bin/env python3
"""
TeTo Learning Platform - FastAPI Server Startup Script
"""

import uvicorn
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

if __name__ == "__main__":
    port = int(os.getenv("PORT", 5001))
    print(f"Starting TeTo Learning Platform server on port {port}")
    print(f"Upload directories: {os.path.join(os.path.dirname(__file__), 'uploads')}")
    
    uvicorn.run(
        "server.main:app",
        host="0.0.0.0",
        port=port,
        reload=True,
        log_level="info"
    ) 