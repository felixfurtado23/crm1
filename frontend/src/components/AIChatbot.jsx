import React from 'react';
import ChatInterface from '../components/ChatInterface';

const AIChatbot = () => {
  return (
    <div className="content-area">
      <div className="page-header">
        <div className="page-title-section">
          <h1 className="page-title">AI Business Assistant</h1>
          <p className="page-subtitle">Get instant insights about your business data</p>
        </div>
      </div>
      
      <ChatInterface />
    </div>
  );
};

export default AIChatbot;