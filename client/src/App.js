import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import VideoPlayer from './components/VideoPlayer';
import Materials from './components/Materials';
import Chatbot from './components/Chatbot';
import Upload from './components/Upload';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Navbar />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="container mx-auto px-4 py-8"
        >
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/videos" element={<VideoPlayer />} />
            <Route path="/materials" element={<Materials />} />
            <Route path="/chatbot" element={<Chatbot />} />
            <Route path="/upload" element={<Upload />} />
          </Routes>
        </motion.div>
      </div>
    </Router>
  );
}

export default App; 