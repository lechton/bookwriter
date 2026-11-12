import { useState } from 'react';

export default function Scoreboard() {
  const [score, setScore] = useState(0);
  const [lastPlay, setLastPlay] = useState('Game start');

  function addPoint() {
    setScore(score + 1);
  }

  function handleOne() {
    addPoint();
    setLastPlay('Free throw');
  }

  function handleTwo() {
    addPoint();
    addPoint();
    setLastPlay('Two-pointer');
  }

  function handleThree() {
    addPoint();
    console.log(score);
    addPoint();
    console.log(score);
    addPoint();
    console.log(score);
    setLastPlay('Three-pointer');
  }

  return (
    <section>
      <h1>Scoreboard</h1>
      <p className="score">Home: {score}</p>
      <p className="last-play">Last play: {lastPlay}</p>
      <button onClick={handleOne}>+1</button>
      <button onClick={handleTwo}>+2</button>
      <button onClick={handleThree}>+3</button>
    </section>
  );
}
