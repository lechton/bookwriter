import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode> {/* Calls components twice in development, and runs click handlers once */}
    <App />
  </StrictMode>
);
