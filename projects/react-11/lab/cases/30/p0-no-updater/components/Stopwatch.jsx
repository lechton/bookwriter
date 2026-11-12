import { useState } from 'react';

export default function Stopwatch() {
  const [seconds, setSeconds] = useState(0);

  function handleStart() {
    setInterval(() => {
      setSeconds(seconds + 1);
    }, 1000);
  }

  return (
    <section>
      <p>Seconds: {seconds}</p>
      <button onClick={handleStart}>Start</button>
      <button>Stop</button>
    </section>
  );
}
