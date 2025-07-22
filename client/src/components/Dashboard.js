import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Video, BookOpen, MessageCircle, Upload, Play, FileText, Bot } from 'lucide-react';
import axios from 'axios';

const Dashboard = () => {
  const [stats, setStats] = useState({
    videos: 0,
    materials: 0,
    totalUploads: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('/api/files');
        setStats({
          videos: response.data.videos.length,
          materials: response.data.materials.length,
          totalUploads: response.data.videos.length + response.data.materials.length
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, []);

  const features = [
    {
      title: 'Video Learning',
      description: 'Watch teacher-uploaded videos with high-quality streaming',
      icon: Video,
      color: 'from-blue-500 to-blue-600',
      path: '/videos'
    },
    {
      title: 'Reading Materials',
      description: 'Access uploaded PDFs, documents, and study materials',
      icon: BookOpen,
      color: 'from-green-500 to-green-600',
      path: '/materials'
    },
    {
      title: 'AI Chatbot',
      description: 'Get instant answers from uploaded materials and web sources',
      icon: Bot,
      color: 'from-purple-500 to-purple-600',
      path: '/chatbot'
    },
    {
      title: 'Upload Content',
      description: 'Upload videos and reading materials for students',
      icon: Upload,
      color: 'from-orange-500 to-orange-600',
      path: '/upload'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to TeTo Learning Platform
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Your comprehensive online learning experience with AI-powered assistance
        </p>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <div className="card">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Play className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.videos}</p>
              <p className="text-gray-600">Videos Available</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.materials}</p>
              <p className="text-gray-600">Reading Materials</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">AI Ready</p>
              <p className="text-gray-600">Chatbot Available</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Features Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <Link key={feature.path} to={feature.path}>
              <motion.div
                whileHover={{ scale: 1.02, y: -5 }}
                whileTap={{ scale: 0.98 }}
                className="card cursor-pointer transition-all duration-200 hover:shadow-xl"
              >
                <div className="flex items-start space-x-4">
                  <div className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-lg flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            </Link>
          );
        })}
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="card"
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link to="/upload">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full btn-primary flex items-center justify-center space-x-2 py-3"
            >
              <Upload className="w-5 h-5" />
              <span>Upload New Content</span>
            </motion.button>
          </Link>
          
          <Link to="/chatbot">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full btn-secondary flex items-center justify-center space-x-2 py-3"
            >
              <Bot className="w-5 h-5" />
              <span>Ask AI Assistant</span>
            </motion.button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard; 