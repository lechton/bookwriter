import { useState, useRef } from 'react';

window.__refs = [];

export default function App() {
  const [count, setCount] = useState(0);
  const ref = useRef(0);
  window.__refs.push(ref);

  function handleClick() {
    setCount(5);
    console.log('count right after setCount(5):', count);
    ref.current = 5;
    console.log('ref.current right after writing 5:', ref.current);
  }

  return <button onClick={handleClick}>Count {count}</button>;
}
