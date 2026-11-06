import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  function handleClick() {
    const nextCount = count + 1;
    setCount(nextCount);
    console.log(count);
    console.log(nextCount);
  }

  return <button onClick={handleClick}>Count: {count}</button>;
}
