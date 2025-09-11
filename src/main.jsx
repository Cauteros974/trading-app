import React from 'react';
import ReactDOM from 'react-dom/client';
import { wrap } from 'framer-motion';
import App from './App';

wrap();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);