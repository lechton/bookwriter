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
  const [isFancy, setIsFancy] = useState(false);
  return (
    <div>
      {isFancy ? (
        <div>
          <Counter person="Anna" />
        </div>
      ) : (
        <section>
          <Counter person="Anna" />
        </section>
      )}
      <button onClick={() => setIsFancy(!isFancy)}>Fancy</button>
    </div>
  );
}
