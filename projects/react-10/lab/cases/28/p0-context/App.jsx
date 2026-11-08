import { createContext, useContext } from 'react';

const ThemeContext = createContext('light');

function Page() {
  return <ShareButton />;
}

function ShareButton() {
  const theme = useContext(ThemeContext);
  return <button className={theme}>Share</button>;
}

export default function App() {
  return (
    <ThemeContext value="dark">
      <Page />
    </ThemeContext>
  );
}
