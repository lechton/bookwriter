import { useState } from 'react';

function ScoreWays() {
  const [score, setScore] = useState(0);

  function handleDirect() {
    setScore(score + 3);
  }

  function handleVariable() {
    const nextScore = score + 3;
    setScore(nextScore);
    console.log(nextScore);
  }

  function addPoint() {
    setScore(s => s + 1);
  }

  return (
    <>
      <p>Score: {score}</p>
      <button className="direct" onClick={handleDirect}>Direct</button>
      <button className="variable" onClick={handleVariable}>Variable</button>
      <button className="point" onClick={addPoint}>Point</button>
    </>
  );
}

export default function App() {
  return <ScoreWays />;
}
