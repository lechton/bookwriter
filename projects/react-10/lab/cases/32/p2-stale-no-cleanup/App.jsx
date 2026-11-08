import { useState } from 'react';
import Counter from './components/Counter.jsx';

export default function App() {
  const [show, setShow] = useState(false);

  return (
    <main>
      <button onClick={() => setShow(!show)}>
        {show ? 'Hide' : 'Show'} counter
      </button>
      {show && <Counter />}
    </main>
  );
}
