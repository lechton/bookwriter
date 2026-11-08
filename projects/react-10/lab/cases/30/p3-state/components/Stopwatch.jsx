import { useState } from 'react';

export default function Stopwatch() {
  const [seconds, setSeconds] = useState(0);
  const [intervalId, setIntervalId] = useState(null);
  console.log('Stopwatch rendered');

  function handleStart() {
    setIntervalId(setInterval(() => {
      setSeconds(s => s + 1);
    }, 1000));
    console.log('intervalId right after setIntervalId:', intervalId);
  }

  function handleStop() {
    clearInterval(intervalId);
    setIntervalId(null);
  }

  return (
    <section>
      <p>Seconds: {seconds}</p>
      <button onClick={handleStart}>Start</button>
      <button onClick={handleStop}>Stop</button>
    </section>
  );
}
