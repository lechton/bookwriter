import { useState } from 'react';

function WayOne() {
  const [count, setCount] = useState(0);

  function handleThree() {
    setCount(count + 1);
    setCount(count + 1);
    setCount(count + 1);
  }

  return <button className="one" onClick={handleThree}>Way 1: {count}</button>;
}

function WayTwo() {
  const [count, setCount] = useState(0);

  function handleThree() {
    setCount(c => c + 1);
    setCount(c => c + 1);
    setCount(c => c + 1);
  }

  return <button className="two" onClick={handleThree}>Way 2: {count}</button>;
}

export default function App() {
  return (
    <>
      <WayOne />
      <WayTwo />
    </>
  );
}
