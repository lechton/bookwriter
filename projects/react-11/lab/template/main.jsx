import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';

const strict = new URLSearchParams(location.search).get('strict') !== '0';

createRoot(document.getElementById('root')).render(
  strict ? (
    <StrictMode>
      <App />
    </StrictMode>
  ) : (
    <App />
  ),
);
