import { useState } from 'react';

export default function Scoreboard() {
  const [score, setScore] = useState(0);
  const [lastPlay, setLastPlay] = useState('Game start');

  function handleThree() {
    setScore(score + 3);
    setLastPlay('Three-pointer');
    alert('Three points for Home!');
  }

  return (
    <section>
      <h1>Scoreboard</h1>
      <p className="score">Home: {score}</p>
      <p className="last-play">Last play: {lastPlay}</p>
      <button onClick={handleThree}>+3</button>
    </section>
  );
}
