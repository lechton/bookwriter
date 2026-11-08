import { useState } from 'react';

export default function App() {
  const [answer, setAnswer] = useState('');
  const [status, setStatus] = useState('typing');

  function handleCheck() {
    if (answer === 'Paris') {
      setStatus('right');
    }
  }

  if (status === 'right') {
    return <h1>That's right!</h1>;
  }

  return (
    <>
      <h2>Capital quiz</h2>
      <p>What is the capital of France?</p>
      <input value={answer} onChange={e => setAnswer(e.target.value)} />
      <button onClick={handleCheck}>Check</button>
    </>
  );
}
