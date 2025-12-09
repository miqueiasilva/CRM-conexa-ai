import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
// import './index.css'; // Comentado para usar o Tailwind via CDN no HTML e evitar erros visuais

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);