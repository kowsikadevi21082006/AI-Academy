import React, { useState } from 'react';
import { askQuestion } from '../services/api';

const ChatBox = () => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!query.trim()) return;

    setLoading(true);
    try {
      console.log("Sending question to backend:", query);
      const data = await askQuestion(query);
      console.log("Received response from backend:", data);
      setResponse(data.response);
      
      // Update history (show last 5)
      const newHistory = [{ q: query, a: data.response }, ...history].slice(0, 5);
      setHistory(newHistory);
      setQuery('');
    } catch (error) {
      console.error("Frontend Error:", error);
      setResponse("Error: Could not connect to backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-card">
      <h1>AI Academy Chatbot</h1>
      <p className="subtitle">Instant answers about our modules & pricing</p>

      <div className="input-group">
        <input 
          type="text" 
          placeholder="Ask a question..." 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
        />
        <button onClick={handleSend} disabled={loading}>
          {loading ? '...' : 'Send'}
        </button>
      </div>

      {response && (
        <div className="response-area">
          <div className="response-label">Chatbot Response</div>
          <p>{response}</p>
        </div>
      )}

      {history.length > 0 && (
        <div className="history-area">
          <div className="history-title">Recent History</div>
          {history.map((item, index) => (
            <div key={index} className="history-item">
              <span className="history-q">Q: {item.q}</span>
              <span className="history-a">A: {item.a}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChatBox;
