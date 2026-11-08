import { useState } from 'react';

export default function CapitalQuiz() {
  const [answer, setAnswer] = useState('');
  const [isEmpty, setIsEmpty] = useState(true);
  const [isChecking, setIsChecking] = useState(false);
  const [isWrong, setIsWrong] = useState(false);
  const [isRight, setIsRight] = useState(false);

  function handleChange(e) {
    setAnswer(e.target.value);
    setIsEmpty(false);
  }

  function handleCheck() {
    setIsChecking(true);
    setTimeout(() => {
      if (answer === 'Paris') {
        setIsChecking(false);
        setIsRight(true);
      } else {
        setIsWrong(true);
      }
    }, 1000);
  }

  if (isRight) {
    return <h1>That's right!</h1>;
  }

  return (
    <>
      <h2>Capital quiz</h2>
      <p>What is the capital of France?</p>
      <input value={answer} onChange={handleChange} disabled={isChecking} />
      <button onClick={handleCheck} disabled={isEmpty || isChecking}>Check</button>
      {isChecking && <p>Checking...</p>}
      {isWrong && <p>Not quite. Try again!</p>}
    </>
  );
}
