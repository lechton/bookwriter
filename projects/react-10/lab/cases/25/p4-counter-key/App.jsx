import { useState } from 'react';

function Counter({ person }) {
  const [count, setCount] = useState(0);
  return (
    <button onClick={() => setCount(count + 1)}>
      {person}: {count}
    </button>
  );
}
export default function App() {
  const [isAnna, setIsAnna] = useState(true);
  return (
    <div>
      {isAnna ? <Counter key="Anna" person="Anna" /> : <Counter key="Ben" person="Ben" />}
      <button onClick={() => setIsAnna(!isAnna)}>Next</button>
    </div>
  );
}
