import { useState } from 'react';

function OrderOne() {
  const [number, setNumber] = useState(0);
  function handleOrderOne() {
    setNumber(number + 5);
    setNumber(n => n + 1);
  }
  return <button className="one" onClick={handleOrderOne}>Order 1: {number}</button>;
}

function OrderTwo() {
  const [number, setNumber] = useState(0);
  function handleOrderTwo() {
    setNumber(n => n + 1);
    setNumber(number + 5);
  }
  return <button className="two" onClick={handleOrderTwo}>Order 2: {number}</button>;
}

function ReplaceAtEnd() {
  const [number, setNumber] = useState(0);
  function handleReplaceAtEnd() {
    setNumber(number + 5);
    setNumber(n => n + 1);
    setNumber(42);
  }
  return <button className="end" onClick={handleReplaceAtEnd}>At end: {number}</button>;
}

function NumberThree() {
  const [number, setNumber] = useState(0);
  function handleClick() {
    setNumber(n => n + 1);
    setNumber(n => n + 1);
    setNumber(n => n + 1);
  }
  return <button className="three" onClick={handleClick}>Three updaters: {number}</button>;
}

export default function App() {
  return (
    <>
      <OrderOne />
      <OrderTwo />
      <ReplaceAtEnd />
      <NumberThree />
    </>
  );
}
