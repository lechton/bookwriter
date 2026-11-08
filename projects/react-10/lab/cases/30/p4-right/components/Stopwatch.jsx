import { useState, useRef } from 'react';

export default function Stopwatch({ label }) {
  const [seconds, setSeconds] = useState(0);
  const intervalRef = useRef(null);

  function handleStart() {
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setSeconds(s => s + 1);
    }, 1000);
  }

  function handleStop() {
    clearInterval(intervalRef.current);
  }

  return (
    <section>
      <h2>{label}</h2>
      <p>Seconds: {seconds}</p>
      <button onClick={handleStart}>Start</button>
      <button onClick={handleStop}>Stop</button>
    </section>
  );
}
