import { useState } from 'react';

export default function Parent() {
  const [count, setCount] = useState(0);
  return (
    <>
      <Counter count={count} onAdd={() => setCount(count + 1)} />
      <Display count={count} />
    </>
  );
}

function Counter({ count, onAdd }) {
  return <button onClick={onAdd}>Clicked {count} times</button>;
}

function Display({ count }) {
  return <p>Count: {count}</p>;
}
