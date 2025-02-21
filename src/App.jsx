// FileUpload.js
import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

const FileUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // API configuration
  const API_ENDPOINT = 'https://txlkoteyb9.execute-api.us-east-1.amazonaws.com/initial';
  const API_KEY = 'AmplifyCognitoAPI$24' //process.env.REACT_APP_API_KEY;
  const BUCKET_NAME = 'ddps-brock-kbase';

  const validateFile = (file) => {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf', 'text/plain'];

    if (file.size > maxSize) {
      return 'File size must be less than 10MB';
    }

    if (!allowedTypes.includes(file.type)) {
      return 'File type not supported. Please upload JPEG, PNG, PDF, or TXT files.';
    }

    return null;
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      const validationError = validateFile(file);
      if (validationError) {
        setUploadStatus(validationError);
        setSelectedFile(null);
        event.target.value = '';
      } else {
        setSelectedFile(file);
        setUploadStatus('');
        setUploadProgress(0);
      }
    }
  };

  const handleUpload = async (event) => {
    event.preventDefault();

    if (!selectedFile) {
      setUploadStatus('Please select a file first');
      return;
    }

    setIsLoading(true);
    setUploadStatus('Uploading...');

    // Create the full API URL
    const uploadUrl = `${API_ENDPOINT}/${BUCKET_NAME}/${selectedFile.name}`;

    try {
      // First, make an OPTIONS request to ensure CORS is working
      await axios({
        method: 'OPTIONS',
        url: uploadUrl,
        headers: {
          'Access-Control-Request-Method': 'PUT',
          'Access-Control-Request-Headers': 'content-type,x-api-key',
          'Origin': window.location.origin
        }
      });

      // Then proceed with the PUT request
      const response = await axios({
        method: 'PUT',
        url: uploadUrl,
        data: selectedFile,
        headers: {
          'Content-Type': selectedFile.type || 'application/octet-stream',
          'x-api-key': API_KEY
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
        }
      });

      setUploadStatus('File uploaded successfully!');
      console.log('Upload response:', response);
      
      // Reset form after successful upload
      setSelectedFile(null);
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = '';
      
    } catch (error) {
      console.error('Upload error:', error);
      let errorMessage = 'Upload failed: ';
      
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        errorMessage += error.response.data?.message || 
                       `Server responded with status ${error.response.status}`;
      } else if (error.request) {
        // The request was made but no response was received
        errorMessage += 'No response received from server';
      } else {
        // Something happened in setting up the request
        errorMessage += error.message;
      }
      
      setUploadStatus(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="file-upload-container">
      <h2>S3 File Upload</h2>
      <form onSubmit={handleUpload}>
        <div className="upload-controls">
          <input
            type="file"
            onChange={handleFileSelect}
            disabled={isLoading}
            accept=".jpg,.jpeg,.png,.pdf,.txt"
          />
          <button 
            type="submit" 
            disabled={!selectedFile || isLoading}
          >
            {isLoading ? 'Uploading...' : 'Upload'}
          </button>
        </div>
        
        {isLoading && (
          <div className="progress-bar-container">
            <div 
              className="progress-bar" 
              style={{ width: `${uploadProgress}%` }}
            />
            <div className="progress-text">{uploadProgress}%</div>
          </div>
        )}

        {uploadStatus && (
          <div className={`status-message ${
            uploadStatus.includes('failed') || 
            uploadStatus.includes('must') || 
            uploadStatus.includes('Please') 
              ? 'error' 
              : 'success'
          }`}>
            {uploadStatus}
          </div>
        )}

        {selectedFile && (
          <div className="file-info">
            <p>Selected file: {selectedFile.name}</p>
            <p>Size: {(selectedFile.size / 1024).toFixed(2)} KB</p>
            <p>Type: {selectedFile.type || 'application/octet-stream'}</p>
          </div>
        )}
      </form>
    </div>
  );
};

export default FileUpload;
