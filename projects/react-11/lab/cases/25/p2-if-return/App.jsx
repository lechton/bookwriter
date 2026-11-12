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
  if (isAnna) {
    return (
      <div>
        <Counter person="Anna" />
        <button onClick={() => setIsAnna(false)}>Next</button>
      </div>
    );
  }
  return (
    <div>
      <Counter person="Ben" />
      <button onClick={() => setIsAnna(true)}>Next</button>
    </div>
  );
}
