import { useState } from 'react';
import Bio from './components/Bio.jsx';

export default function App() {
  const [show, setShow] = useState(true);

  return (
    <main>
      <button onClick={() => setShow(false)}>Close</button>
      {show && <Bio person="Bob" />}
    </main>
  );
}
