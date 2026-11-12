import { useState } from 'react';

export default function Parent() {
  return (
    <>
      <Counter />
      <Display />
    </>
  );
}

function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>Clicked {count} times</button>;
}

function Display() {
  const [count, setCount] = useState(0);
  return <p>Count: {count}</p>;
}
