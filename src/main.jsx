import React from 'react'
import ReactDOM from 'react-dom/client'
import { Amplify } from 'aws-amplify'
import App from './App'
import './style.css'
import awsconfig from './aws-exports'
import { AuthProvider } from './components/AuthContext'

Amplify.configure(awsconfig)

ReactDOM.createRoot(document.getElementById('root')).render(
 
    <AuthProvider>
      <App />
    </AuthProvider>
 
)
