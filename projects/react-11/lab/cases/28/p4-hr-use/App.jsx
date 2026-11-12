import { useState, use } from 'react';
import { ThemeContext } from './ThemeContext.js';

function HorizontalRule({ show }) {
  if (show) {
    const theme = use(ThemeContext);
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
