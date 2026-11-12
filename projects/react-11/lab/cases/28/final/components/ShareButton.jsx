import { use } from 'react';
import { ThemeContext } from '../ThemeContext.js';

export default function ShareButton() {
  const theme = use(ThemeContext);
  return <button className={theme}>Share</button>;
}
