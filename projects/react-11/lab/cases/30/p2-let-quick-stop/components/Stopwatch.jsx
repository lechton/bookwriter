import { useState } from 'react';

export default function Stopwatch() {
  const [seconds, setSeconds] = useState(0);
  let intervalId = null;

  function handleStart() {
    intervalId = setInterval(() => {
      setSeconds(s => s + 1);
    }, 1000);
  }

  function handleStop() {
    clearInterval(intervalId);
  }

  return (
    <section>
      <p>Seconds: {seconds}</p>
      <button onClick={handleStart}>Start</button>
      <button onClick={handleStop}>Stop</button>
    </section>
  );
}
