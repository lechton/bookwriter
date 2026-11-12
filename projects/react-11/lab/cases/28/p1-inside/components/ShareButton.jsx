import { createContext, useContext } from 'react';

export default function ShareButton() {
  const ThemeContext = createContext('light');
  const theme = useContext(ThemeContext);
  return <button className={theme}>Share</button>;
}
