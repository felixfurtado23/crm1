import React from 'react';
import ChatInterface from '../components/ChatInterface';

const AIChatbot = () => {
  return (
    <div className="content-area">
      <div className="page-header">
        <div className="page-title-section">
          <h1 className="page-title">AI Business Assistant</h1>
          <p className="page-subtitle">Upload CSV files and get instant insights about your business data</p>
        </div>
        <div className="page-header-badge">
          <i className="fas fa-brain"></i>
          AI Powered Analytics
        </div>
      </div>
      
      <ChatInterface />
    </div>
  );
};

export default AIChatbot;