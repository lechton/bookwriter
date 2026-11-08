import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  function onTick() {
    console.log('Tick');
    setCount(c => c + 1);
  }
  setInterval(onTick, 1000);

  return <h1>{count}</h1>;
}
