import React from 'react';
import { createRoot } from 'react-dom/client';
import App from '../Store Tycoon.tsx';
import './style.css';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Could not find the app root element.');
}

createRoot(rootElement).render(<App />);
