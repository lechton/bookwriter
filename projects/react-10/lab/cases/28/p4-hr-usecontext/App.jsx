import { useState, useContext } from 'react';
import { ThemeContext } from './ThemeContext.js';

function HorizontalRule({ show }) {
  if (show) {
    const theme = useContext(ThemeContext);
    return <hr className={theme} />;
  }
  return false;
}

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <ThemeContext value="dark">
      <button onClick={() => setShow(!show)}>Show rule</button>
      <HorizontalRule show={show} />
    </ThemeContext>
  );
}
