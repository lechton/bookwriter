import { useState } from 'react';

export default function CapitalQuiz() {
  const [answer, setAnswer] = useState('');
  const [status, setStatus] = useState('typing');

  function handleCheck() {
    setStatus('checking');
    setTimeout(() => {
      setStatus(answer === 'Paris' ? 'right' : 'wrong');
    }, 1000);
  }

  if (status === 'right') {
    return <h1>That's right!</h1>;
  }

  return (
    <>
      <h2>Capital quiz</h2>
      <p>What is the capital of France?</p>
      <input value={answer} onChange={e => setAnswer(e.target.value)} disabled={status === 'checking'} />
      <button onClick={handleCheck} disabled={answer.length === 0 || status === 'checking'}>Check</button>
      {status === 'checking' && <p>Checking...</p>}
      {status === 'wrong' && <p>Not quite. Try again!</p>}
    </>
  );
}
