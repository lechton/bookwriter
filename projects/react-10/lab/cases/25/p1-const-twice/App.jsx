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
  const counter = <Counter person="Anna" />;
  return (
    <div>
      {counter}
      {counter}
    </div>
  );
}
