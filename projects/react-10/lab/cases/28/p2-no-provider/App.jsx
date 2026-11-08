import { useState } from 'react';
import Page from './components/Page.jsx';

export default function App() {
  const [theme, setTheme] = useState('light');
  return (
    <div>
      <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
        Toggle theme
      </button>
      <Page />
    </div>
  );
}
