import { useState, useEffect } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    function onTick() {
      console.log('Tick');
      setCount(c => c + 1);
    }
    console.log('Timer started');
    const intervalId = setInterval(onTick, 1000);
    return () => {
      console.log('Timer stopped');
      clearInterval(intervalId);
    };
  }, []);

  return <h1>{count}</h1>;
}
