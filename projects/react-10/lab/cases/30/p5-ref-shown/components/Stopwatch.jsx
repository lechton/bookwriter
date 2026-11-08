import { useRef } from 'react';

export default function Stopwatch({ label }) {
  const intervalRef = useRef(null);

  const secondsRef = useRef(0);

  function handleStart() {
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      secondsRef.current = secondsRef.current + 1;
    }, 1000);
  }

  function handleStop() {
    clearInterval(intervalRef.current);
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
