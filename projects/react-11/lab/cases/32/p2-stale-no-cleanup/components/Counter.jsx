import { useState, useEffect } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    setInterval(() => setCount(count + 1), 1000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <h1>{count}</h1>;
}
