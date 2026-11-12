import { useRef, useState, useEffect } from 'react';

export default function App() {
  const ref = useRef('general');
  const [count, setCount] = useState(0);
  useEffect(() => {
    console.log('Effect runs with ref.current = ' + ref.current);
  }, [ref.current]);
  return (
    <main>
      <button onClick={() => { ref.current = 'travel'; }}>Mutate ref</button>
      <button onClick={() => setCount(count + 1)}>Re-render {count}</button>
    </main>
  );
}
