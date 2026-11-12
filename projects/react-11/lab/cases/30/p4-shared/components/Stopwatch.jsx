import { useState } from 'react';

let intervalId = null;

export default function Stopwatch({ label }) {
  const [seconds, setSeconds] = useState(0);

  function handleStart() {
    clearInterval(intervalId);
    intervalId = setInterval(() => {
      setSeconds(s => s + 1);
    }, 1000);
  }

  function handleStop() {
    clearInterval(intervalId);
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
