import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx';
import { BrowserRouter } from 'react-router-dom';
import { DataProvider } from './context/DataContext.jsx';

createRoot(document.getElementById('root')).render(
 
  <React.StrictMode>
   <BrowserRouter>
      <AuthProvider>
        <DataProvider>
        <App />
        </DataProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
