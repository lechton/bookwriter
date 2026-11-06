import { useState } from 'react';

let calls = 0;

export default function App() {
  const [score, setScore] = useState(() => {
    console.log('initializer runs');
    return 0;
  });
  const [kept, setKept] = useState(0);
  console.log('render, score is ' + score);

  function handleThree() {
    console.log('handler starts');
    setScore(s => { console.log('updater 1 gets ' + s); return s + 1; });
    setScore(s => { console.log('updater 2 gets ' + s); return s + 1; });
    setScore(s => { console.log('updater 3 gets ' + s); return s + 1; });
    console.log('handler ends');
  }

  function handleKept() {
    setKept(k => k + 100);
    setKept(k => { calls += 1; console.log('counting updater call ' + calls + ' gets ' + k); return calls; });
  }

  return (
    <>
      <p>Home: {score}</p>
      <p>Kept: {kept}</p>
      <button className="three" onClick={handleThree}>+3</button>
      <button className="kept" onClick={handleKept}>Kept</button>
    </>
  );
}
