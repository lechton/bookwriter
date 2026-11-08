import { useState, useRef } from 'react';

export default function Stopwatch({ label }) {
  const [intervalId, setIntervalId] = useState(null);

  const secondsRef = useRef(0);

  function handleStart() {
    clearInterval(intervalId);
    setIntervalId(setInterval(() => {
      secondsRef.current = secondsRef.current + 1;
    }, 1000));
  }

  function handleStop() {
    clearInterval(intervalId);
    setIntervalId(null);
  }

  return (
    <section>
      <h2>{label}</h2>
      <p>Seconds: {secondsRef.current}</p>
      <button onClick={handleStart}>Start</button>
      <button onClick={handleStop}>Stop</button>
    </section>
  );
}
