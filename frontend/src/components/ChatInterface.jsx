import React, { useState, useRef, useEffect } from 'react';

const ChatInterface = () => {
  const [messages, setMessages] = useState([
    {
      type: 'ai',
      text: "Hello! I'm your AI Business Assistant. I can help you analyze your business data. You can upload a CSV file or ask me questions about invoices, sales, and payments.",
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [csvData, setCsvData] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Sample business data
  const businessData = {
    "overdue": [
      { id: 'INV-001', customer: 'John Smith', amount: 5000, dueDate: '2024-01-15', status: 'overdue' },
      { id: 'INV-002', customer: 'John Smith', amount: 5000, dueDate: '2024-01-20', status: 'overdue' },
      { id: 'INV-006', customer: 'Mike Johnson', amount: 3200, dueDate: '2024-01-10', status: 'overdue' }
    ],
    "sales": [
      { month: 'September 2025', amount: 125000, growth: '+15%' },
      { month: 'August 2025', amount: 108000, growth: '+8%' },
      { month: 'July 2025', amount: 100000, growth: '+5%' }
    ],
    "pending": [
      { id: 'INV-003', customer: 'Sarah Corp', amount: 15000, dueDate: '2024-02-01', status: 'pending' },
      { id: 'INV-004', customer: 'Sarah Corp', amount: 10000, dueDate: '2024-02-15', status: 'pending' },
      { id: 'INV-005', customer: 'Sarah Corp', amount: 8000, dueDate: '2024-02-28', status: 'pending' }
    ],
    "customers": [
      { name: 'John Smith', totalInvoices: 12, totalAmount: 45000, status: 'Active' },
      { name: 'Sarah Corp', totalInvoices: 8, totalAmount: 33000, status: 'Active' },
      { name: 'Mike Johnson', totalInvoices: 5, totalAmount: 15000, status: 'Active' }
    ]
  };

  const processQuery = (query) => {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('overdue') || lowerQuery.includes('late')) {
      const overdue = businessData.overdue;
      const total = overdue.reduce((sum, inv) => sum + inv.amount, 0);
      return {
        answer: `You have ${overdue.length} overdue invoices totaling $${total.toLocaleString()}`,
        details: overdue,
        type: 'overdue'
      };
    }
    
    if (lowerQuery.includes('sales') || lowerQuery.includes('revenue')) {
      const sales = businessData.sales;
      const current = sales[0];
      return {
        answer: `Your sales performance: Current month (${current.month}) - $${current.amount.toLocaleString()} ${current.growth} from previous month`,
        details: sales,
        type: 'sales'
      };
    }
    
    if (lowerQuery.includes('pending') || lowerQuery.includes('outstanding')) {
      const pending = businessData.pending;
      const total = pending.reduce((sum, inv) => sum + inv.amount, 0);
      return {
        answer: `You have ${pending.length} pending payments totaling $${total.toLocaleString()}`,
        details: pending,
        type: 'pending'
      };
    }
    
    if (lowerQuery.includes('customer') || lowerQuery.includes('client')) {
      const customers = businessData.customers;
      return {
        answer: `You have ${customers.length} active customers with outstanding invoices`,
        details: customers,
        type: 'customers'
      };
    }
    
    if (lowerQuery.includes('hello') || lowerQuery.includes('hi')) {
      return {
        answer: "Hello! I'm your AI Business Assistant. I can help you analyze invoices, sales data, customer information, and more. Try asking about overdue invoices or sales performance.",
        details: [],
        type: 'greeting'
      };
    }
    
    return {
      answer: "I can help you analyze business data. Try asking about:\n• Overdue invoices\n• Sales performance\n• Pending payments\n• Customer information\nOr upload a CSV file for analysis.",
      details: [],
      type: 'help'
    };
  };

  const handleSend = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage = { type: 'user', text: inputText, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    await new Promise(resolve => setTimeout(resolve, 800));

    const response = processQuery(inputText);
    const aiMessage = { 
      type: 'ai', 
      text: response.answer,
      data: response.details,
      dataType: response.type,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, aiMessage]);
    setIsLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'text/csv') {
      const reader = new FileReader();
      reader.onload = (e) => {
        const csvText = e.target.result;
        setCsvData(csvText);
        
        // Add message about uploaded file
        const uploadMessage = {
          type: 'ai',
          text: `✅ Successfully uploaded CSV file: ${file.name}\nI've loaded your data and can now help you analyze it. Try asking questions about your data.`,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, uploadMessage]);
      };
      reader.readAsText(file);
    } else {
      alert('Please upload a valid CSV file');
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const quickActions = [
    { text: "Show overdue invoices", icon: "fas fa-file-invoice" },
    { text: "Sales performance", icon: "fas fa-chart-line" },
    { text: "Pending payments", icon: "fas fa-clock" },
    { text: "Customer summary", icon: "fas fa-users" }
  ];

  const handleQuickAction = (text) => {
    setInputText(text);
  };

  return (
    <div className="ai-chat-interface">
      {/* Header with File Upload */}
      <div className="chat-header">
        <div className="header-left">
          <div className="ai-avatar">
            <i className="fas fa-robot"></i>
          </div>
          <div className="header-info">
            <h3>Business Assistant</h3>
            <p>Analyze your business data</p>
          </div>
        </div>
        <div className="file-upload-section">
          <label className="file-upload-btn">
            <i className="fas fa-file-csv"></i>
            Upload CSV
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              style={{ display: 'none' }}
            />
          </label>
          {csvData && (
            <div className="file-indicator">
              <i className="fas fa-check"></i>
              CSV Loaded
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions-bar">
        <span>Quick insights:</span>
        <div className="action-buttons">
          {quickActions.map((action, index) => (
            <button
              key={index}
              className="action-btn"
              onClick={() => handleQuickAction(action.text)}
            >
              <i className={action.icon}></i>
              {action.text}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages */}
      <div className="chat-messages">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.type}`}>
            <div className="message-avatar">
              {message.type === 'user' ? (
                <i className="fas fa-user"></i>
              ) : (
                <i className="fas fa-robot"></i>
              )}
            </div>
            <div className="message-content">
              <div className="message-bubble">
                <div className="message-text">{message.text}</div>
                
                {/* Data Display */}
                {message.data && message.data.length > 0 && (
                  <div className="data-display">
                    {message.dataType === 'overdue' && (
                      <div className="data-section">
                        <h4>Overdue Invoices</h4>
                        {message.data.map((invoice, idx) => (
                          <div key={idx} className="data-item overdue">
                            <div className="data-main">
                              <span className="invoice-id">{invoice.id}</span>
                              <span className="customer">{invoice.customer}</span>
                            </div>
                            <div className="data-details">
                              <span className="amount">${invoice.amount.toLocaleString()}</span>
                              <span className="due-date">{invoice.dueDate}</span>
                              <span className="status-badge overdue">Overdue</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {message.dataType === 'sales' && (
                      <div className="data-section">
                        <h4>Sales Performance</h4>
                        {message.data.map((sale, idx) => (
                          <div key={idx} className="data-item sales">
                            <span className="month">{sale.month}</span>
                            <span className="amount">${sale.amount.toLocaleString()}</span>
                            <span className={`growth ${sale.growth.includes('+') ? 'positive' : 'negative'}`}>
                              {sale.growth}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {message.dataType === 'pending' && (
                      <div className="data-section">
                        <h4>Pending Payments</h4>
                        {message.data.map((invoice, idx) => (
                          <div key={idx} className="data-item pending">
                            <div className="data-main">
                              <span className="invoice-id">{invoice.id}</span>
                              <span className="customer">{invoice.customer}</span>
                            </div>
                            <div className="data-details">
                              <span className="amount">${invoice.amount.toLocaleString()}</span>
                              <span className="due-date">{invoice.dueDate}</span>
                              <span className="status-badge pending">Pending</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {message.dataType === 'customers' && (
                      <div className="data-section">
                        <h4>Active Customers</h4>
                        {message.data.map((customer, idx) => (
                          <div key={idx} className="data-item customer">
                            <span className="name">{customer.name}</span>
                            <span className="invoices">{customer.totalInvoices} invoices</span>
                            <span className="amount">${customer.totalAmount.toLocaleString()}</span>
                            <span className="status-badge active">{customer.status}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="message-time">
                {formatTime(message.timestamp)}
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="message ai">
            <div className="message-avatar">
              <i className="fas fa-robot"></i>
            </div>
            <div className="message-content">
              <div className="message-bubble">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="chat-input-area">
        <div className="input-container">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about your business data... (e.g., 'show me sales performance')"
            className="chat-input"
            disabled={isLoading}
          />
          <button 
            onClick={handleSend} 
            className="send-btn"
            disabled={isLoading || !inputText.trim()}
          >
            {isLoading ? (
              <i className="fas fa-spinner fa-spin"></i>
            ) : (
              <i className="fas fa-paper-plane"></i>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;