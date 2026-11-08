import { useContext } from 'react';
import { ThemeContext } from '../ThemeContext.js';

export default function ShareButton() {
  const theme = useContext(ThemeContext);
  console.log('ShareButton runs with', theme);
  return <button className={theme}>Share</button>;
}
