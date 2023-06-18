import React from 'react';
import ReactDOM from 'react-dom/client';
import '@availity/block-ui/dist/index.css';
import './index.css';
import App from './components/App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
