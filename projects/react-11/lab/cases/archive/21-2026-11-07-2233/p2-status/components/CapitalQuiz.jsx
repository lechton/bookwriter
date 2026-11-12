import { useState } from 'react';

export default function CapitalQuiz() {
  const [answer, setAnswer] = useState('');
  const [isEmpty, setIsEmpty] = useState(true);
  const [status, setStatus] = useState('typing');

  function handleChange(e) {
    setAnswer(e.target.value);
    setIsEmpty(false);
  }

  function handleCheck() {
    setStatus('checking');
    setTimeout(() => {
      if (answer === 'Paris') {
        setStatus('right');
      } else {
        setStatus('wrong');
      }
    }, 1000);
  }

  if (status === 'right') {
    return <h1>That's right!</h1>;
  }

  return (
    <>
      <h2>Capital quiz</h2>
      <p>What is the capital of France?</p>
      <input value={answer} onChange={handleChange} disabled={status === 'checking'} />
      <button onClick={handleCheck} disabled={isEmpty || status === 'checking'}>Check</button>
      {status === 'checking' && <p>Checking...</p>}
      {status === 'wrong' && <p>Not quite. Try again!</p>}
    </>
  );
}
