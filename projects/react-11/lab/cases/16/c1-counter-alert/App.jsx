import { useState } from 'react';

function CounterAlert() {
  const [count, setCount] = useState(0);
  const [label, setLabel] = useState('Not clicked');

  function handleClick() {
    setCount(count + 1);
    setLabel('Clicked');
    alert('Done');
  }

  return <button onClick={handleClick}>{label}: {count}</button>;
}

export default function App() {
  return <CounterAlert />;
}
