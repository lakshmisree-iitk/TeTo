#!/bin/bash

echo "Setting up TeTo Learning Platform - Python FastAPI Version"

# Check if Python 3 is installed
if ! command -v python3 &> /dev/null; then
    echo "Python 3 is not installed. Please install Python 3.8 or higher."
    exit 1
fi

# Check Python version
python_version=$(python3 -c 'import sys; print(".".join(map(str, sys.version_info[:2])))')
echo "Python version: $python_version"

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate

# Upgrade pip
echo "Upgrading pip..."
pip install --upgrade pip

# Install Python dependencies
echo "Installing Python dependencies..."
pip install -r requirements.txt

# Create upload directories
echo "Creating upload directories..."
mkdir -p uploads/videos
mkdir -p uploads/materials

echo "Python setup complete!"
echo ""
echo "To start the Python FastAPI server:"
echo "  source venv/bin/activate"
echo "  python start_server.py"
echo ""
echo "Or use npm:"
echo "  npm run server:python" 