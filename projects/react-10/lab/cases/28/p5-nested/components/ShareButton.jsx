import { useContext } from 'react';
import { ThemeContext } from '../ThemeContext.js';

export default function ShareButton() {
  const theme = useContext(ThemeContext);
  return <button className={theme}>Share</button>;
}
