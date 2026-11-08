import { useState, useEffect, useRef } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    function onTick() {
      console.log('Tick');
      setCount(c => c + 1);
    }
    console.log('Timer started');
    setInterval(onTick, 1000);
  }, []);

  return <h1>{count}</h1>;
}
