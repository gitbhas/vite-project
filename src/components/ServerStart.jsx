import React, { useState } from 'react';
import './App.css';

function App() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [submitStatus, setSubmitStatus] = useState('');
  const [searchName, setSearchName] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchError, setSearchError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus('Submitting...');

    try {
      const response = await fetch('https://9c03dh9mv2.execute-api.us-east-1.amazonaws.com/initial/post-dynamo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitStatus('Form submitted successfully!');
        setFormData({ name: '', email: '', message: '' });
      } else {
        setSubmitStatus('Error submitting form. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      setSubmitStatus('Error submitting form. Please try again.');
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setSearchError('');
    try {
      const response = await fetch(
        `https://9c03dh9mv2.execute-api.us-east-1.amazonaws.com/initial/search-dynamo?name=${encodeURIComponent(searchName)}`
      );
      
      if (response.ok) {
        const data = await response.json();
        console.log('Search response:', data);
        
        if (data.items) {
          setSearchResults(data.items);
        } else {
          setSearchResults([]);
          setSearchError('No results found');
        }
      } else {
        setSearchError('Error searching records');
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Error:', error);
      setSearchError('Error searching records');
      setSearchResults([]);
    }
  };

  return (
    <div className="App">
      <h1>Contact Form</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="message">Message:</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
          ></textarea>
        </div>
        <button type="submit">Submit</button>
      </form>
      {submitStatus && <p className="status-message">{submitStatus}</p>}

      <h2>Search Submissions</h2>
      <form onSubmit={handleSearch}>
        <div>
          <label htmlFor="searchName">Search by Name:</label>
          <input
            type="text"
            id="searchName"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            required
          />
        </div>
        <button type="submit">Search</button>
      </form>

      {searchError && <p className="error-message">{searchError}</p>}
      
      {searchResults.length > 0 && (
        <div className="search-results">
          <h3>Search Results:</h3>
          <ul>
            {searchResults.map((result, index) => (
              <li key={index} className="result-item">
                <div><strong>Name:</strong> {result.name}</div>
                <div><strong>Email:</strong> {result.email}</div>
                <div><strong>Message:</strong> {result.message}</div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
