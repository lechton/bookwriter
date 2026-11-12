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
  const [showBen, setShowBen] = useState(true);
  return (
    <div>
      <Counter person="Anna" />
      {showBen && <Counter person="Ben" />}
      <button onClick={() => setShowBen(!showBen)}>Show or hide Ben</button>
    </div>
  );
}
