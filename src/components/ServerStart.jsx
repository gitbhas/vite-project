import React, { useState, useEffect } from 'react';
import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";
import { BedrockAgentRuntimeClient, RetrieveCommand } from "@aws-sdk/client-bedrock-agent-runtime";
import './App.css';

function App() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('chat'); // 'chat' or 'knowledge'
  const [error, setError] = useState(null);
  
  // Configure AWS credentials from environment variables1
  const region = process.env.REACT_APP_AWS_REGION || 'us-east-1';
  const credentials = {
    accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY
  };

  // Initialize Bedrock clients
  const bedrockRuntime = new BedrockRuntimeClient({ 
    region,
    credentials 
  });

  const bedrockAgentRuntime = new BedrockAgentRuntimeClient({
    region,
    credentials
  });

  // Knowledge Base ID from environment variables
  const knowledgeBaseId = process.env.REACT_APP_KNOWLEDGE_BASE_ID;

  const handleChat = async (message) => {
    try {
      setIsLoading(true);
      setError(null);

      // Format the message for Claude model
      const prompt = {
        prompt: `\n\nHuman: ${message}\n\nAssistant:`,
        max_tokens_to_sample: 2000,
        temperature: 0.7,
        top_p: 0.9,
      };

      // Create the command to invoke the model
      const command = new InvokeModelCommand({
        modelId: "anthropic.claude-3-5-sonnet-20240620-v1:0", // or your preferred model
        contentType: "application/json",
        accept: "application/json",
        body: JSON.stringify(prompt)
      });

      // Send the request to Bedrock
      const response = await bedrockRuntime.send(command);
      
      // Parse the response
      const responseBody = JSON.parse(new TextDecoder().decode(response.body));
      
      // Update messages with both user input and AI response
      setMessages(prevMessages => [
        ...prevMessages,
        { role: 'user', content: message },
        { role: 'assistant', content: responseBody.completion }
      ]);

    } catch (err) {
      console.error('Error in chat:', err);
      setError('Failed to get response from chat model');
    } finally {
      setIsLoading(false);
    }
  };

  const queryKnowledgeBase = async (query) => {
    try {
      setIsLoading(true);
      setError(null);

      // Create the command to query the knowledge base
      const command = new RetrieveCommand({
        knowledgeBaseId: knowledgeBaseId,
        retrievalQuery: query,
        retrievalConfiguration: {
          vectorSearchConfiguration: {
            numberOfResults: 3
          }
        }
      });

      // Send the request to Bedrock Agent Runtime
      const response = await bedrockAgentRuntime.send(command);

      // Update messages with both query and response
      setMessages(prevMessages => [
        ...prevMessages,
        { role: 'user', content: query },
        { 
          role: 'assistant', 
          content: response.retrievalResults
            .map(result => result.content)
            .join('\n\n') 
        }
      ]);

    } catch (err) {
      console.error('Error in knowledge base query:', err);
      setError('Failed to query knowledge base');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const message = inputMessage;
    setInputMessage('');

    if (activeTab === 'chat') {
      await handleChat(message);
    } else {
      await queryKnowledgeBase(message);
    }
  };

  return (
    <div className="app-container">
      <div className="header">
        <h1>Bedrock AI Assistant</h1>
        <div className="tabs">
          <button 
            className={`tab ${activeTab === 'chat' ? 'active' : ''}`}
            onClick={() => setActiveTab('chat')}
          >
            Chat
          </button>
          <button 
            className={`tab ${activeTab === 'knowledge' ? 'active' : ''}`}
            onClick={() => setActiveTab('knowledge')}
          >
            Knowledge Base
          </button>
        </div>
      </div>

      <div className="messages-container">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.role}`}>
            <div className="message-content">{msg.content}</div>
          </div>
        ))}
        {isLoading && <div className="loading">Processing...</div>}
        {error && <div className="error">{error}</div>}
      </div>

      <form onSubmit={handleSubmit} className="input-form">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder={activeTab === 'chat' ? "Type your message..." : "Ask a question..."}
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading || !inputMessage.trim()}>
          Send
        </button>
      </form>
    </div>
  );
}

export default App;
