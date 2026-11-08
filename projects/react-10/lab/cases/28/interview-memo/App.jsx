import { useState, use, memo, createContext } from 'react';
import { ThemeContext } from './ThemeContext.js';

const ThemeSetterContext = createContext(null);

function ShareButton() {
  const theme = use(ThemeContext);
  return <button className={theme}>Share</button>;
}

const Card = memo(function Card() {
  console.log('Card runs');
  return <ShareButton />;
});

function Reader() {
  const pair = use(ThemeSetterContext);
  console.log('Reader runs');
  return null;
}

const MemoReader = memo(Reader);

export default function App() {
  const [theme, setTheme] = useState('light');
  const [count, setCount] = useState(0);
  return (
    <ThemeContext value={theme}>
      <ThemeSetterContext value={{ theme, setTheme }}>
        <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>Toggle theme</button>
        <button onClick={() => setCount(count + 1)}>Count {count}</button>
        <Card />
        <MemoReader />
      </ThemeSetterContext>
    </ThemeContext>
  );
}
