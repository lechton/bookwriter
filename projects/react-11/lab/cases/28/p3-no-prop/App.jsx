import { useState } from 'react';
import { ThemeContext } from './ThemeContext.js';
import Page from './components/Page.jsx';

export default function App() {
  const [theme, setTheme] = useState('light');
  return (
    <ThemeContext>
      <div>
        <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
          Toggle theme
        </button>
        <Page />
      </div>
    </ThemeContext>
  );
}
