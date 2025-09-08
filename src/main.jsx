import React from 'react';
import ReactDOM from 'react-dom/client';
import { r as million } from 'million/react';
import App from './App.jsx';

million.wrap();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);