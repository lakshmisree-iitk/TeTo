import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { Upload as UploadIcon, Video, FileText, CheckCircle, AlertCircle, X } from 'lucide-react';
import axios from 'axios';

const Upload = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [uploadType, setUploadType] = useState('video');

  const onDrop = useCallback(async (acceptedFiles) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    setUploading(true);
    setUploadStatus(null);

    const formData = new FormData();
    formData.append(uploadType, file);

    try {
      const endpoint = uploadType === 'video' ? '/api/upload/video' : '/api/upload/material';
      const response = await axios.post(endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadStatus({
            type: 'progress',
            message: `Uploading... ${percentCompleted}%`,
            progress: percentCompleted
          });
        }
      });

      setUploadStatus({
        type: 'success',
        message: `${uploadType === 'video' ? 'Video' : 'Material'} uploaded successfully!`,
        data: response.data
      });

      // Reset form after successful upload
      setTimeout(() => {
        setUploadStatus(null);
      }, 3000);

    } catch (error) {
      console.error('Upload error:', error);
      setUploadStatus({
        type: 'error',
        message: error.response?.data?.error || 'Upload failed. Please try again.'
      });
    } finally {
      setUploading(false);
    }
  }, [uploadType]);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: uploadType === 'video' 
      ? { 'video/*': ['.mp4', '.avi', '.mov', '.wmv', '.flv', '.webm'] }
      : { 'application/pdf': ['.pdf'], 'application/msword': ['.doc'], 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'], 'text/plain': ['.txt'], 'application/rtf': ['.rtf'] },
    multiple: false,
    disabled: uploading
  });

  const getUploadIcon = () => {
    if (uploadType === 'video') {
      return <Video className="w-8 h-8 text-blue-600" />;
    }
    return <FileText className="w-8 h-8 text-green-600" />;
  };

  const getUploadTitle = () => {
    return uploadType === 'video' ? 'Upload Video' : 'Upload Reading Material';
  };

  const getUploadDescription = () => {
    if (uploadType === 'video') {
      return 'Drag and drop a video file here, or click to select';
    }
    return 'Drag and drop a document file here, or click to select';
  };

  const getAcceptedFormats = () => {
    if (uploadType === 'video') {
      return 'MP4, AVI, MOV, WMV, FLV, WebM';
    }
    return 'PDF, DOC, DOCX, TXT, RTF';
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Upload Content</h1>
        <p className="text-gray-600">Upload videos and reading materials for students</p>
      </motion.div>

      {/* Upload Type Selector */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card"
      >
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Upload Type</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => setUploadType('video')}
            className={`p-4 rounded-lg border-2 transition-all duration-200 ${
              uploadType === 'video'
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-blue-300'
            }`}
          >
            <div className="flex items-center space-x-3">
              <Video className="w-6 h-6 text-blue-600" />
              <div className="text-left">
                <h3 className="font-medium text-gray-900">Video</h3>
                <p className="text-sm text-gray-600">Upload lecture videos</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => setUploadType('material')}
            className={`p-4 rounded-lg border-2 transition-all duration-200 ${
              uploadType === 'material'
                ? 'border-green-500 bg-green-50'
                : 'border-gray-200 hover:border-green-300'
            }`}
          >
            <div className="flex items-center space-x-3">
              <FileText className="w-6 h-6 text-green-600" />
              <div className="text-left">
                <h3 className="font-medium text-gray-900">Reading Material</h3>
                <p className="text-sm text-gray-600">Upload documents and PDFs</p>
              </div>
            </div>
          </button>
        </div>
      </motion.div>

      {/* Upload Area */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card"
      >
        <h2 className="text-lg font-semibold text-gray-900 mb-4">{getUploadTitle()}</h2>
        
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
            isDragActive
              ? 'border-primary-500 bg-primary-50'
              : isDragReject
              ? 'border-red-500 bg-red-50'
              : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
          } ${uploading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        >
          <input {...getInputProps()} />
          
          <div className="space-y-4">
            {getUploadIcon()}
            
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {isDragActive ? 'Drop the file here' : getUploadDescription()}
              </h3>
              <p className="text-sm text-gray-600">
                Accepted formats: {getAcceptedFormats()}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Maximum file size: 100MB
              </p>
            </div>

            {isDragReject && (
              <div className="flex items-center justify-center space-x-2 text-red-600">
                <AlertCircle className="w-5 h-5" />
                <span>File type not supported</span>
              </div>
            )}
          </div>
        </div>

        {/* Upload Status */}
        {uploadStatus && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mt-4 p-4 rounded-lg flex items-center space-x-3 ${
              uploadStatus.type === 'success'
                ? 'bg-green-50 border border-green-200'
                : uploadStatus.type === 'error'
                ? 'bg-red-50 border border-red-200'
                : 'bg-blue-50 border border-blue-200'
            }`}
          >
            {uploadStatus.type === 'success' ? (
              <CheckCircle className="w-5 h-5 text-green-600" />
            ) : uploadStatus.type === 'error' ? (
              <AlertCircle className="w-5 h-5 text-red-600" />
            ) : (
              <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            )}
            
            <div className="flex-1">
              <p className={`text-sm font-medium ${
                uploadStatus.type === 'success'
                  ? 'text-green-800'
                  : uploadStatus.type === 'error'
                  ? 'text-red-800'
                  : 'text-blue-800'
              }`}>
                {uploadStatus.message}
              </p>
              
              {uploadStatus.type === 'progress' && uploadStatus.progress && (
                <div className="mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadStatus.progress}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => setUploadStatus(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </motion.div>

      {/* Instructions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="card"
      >
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Upload Guidelines</h2>
        <div className="space-y-3 text-sm text-gray-600">
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-primary-600 rounded-full mt-2"></div>
            <p>Ensure your files are in the supported formats listed above</p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-primary-600 rounded-full mt-2"></div>
            <p>Keep file sizes under 100MB for optimal performance</p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-primary-600 rounded-full mt-2"></div>
            <p>Reading materials will be processed for AI chatbot access</p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-primary-600 rounded-full mt-2"></div>
            <p>Videos will be available for streaming in the video player</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Upload; 