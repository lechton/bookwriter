import { useState, useContext } from 'react';
import { ThemeContext } from './ThemeContext.js';
import Page from './components/Page.jsx';

export default function App() {
  const [theme, setTheme] = useState('light');
  const buttonTheme = useContext(ThemeContext);
  return (
    <ThemeContext value={theme}>
      <div>
        <button className={buttonTheme} onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
          Toggle theme
        </button>
        <Page />
      </div>
    </ThemeContext>
  );
}
