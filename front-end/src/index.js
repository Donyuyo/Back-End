// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import App from './App';


// Correct way to mount the App in React 18
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
