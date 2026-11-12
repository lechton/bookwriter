export default function CapitalQuiz({ status = 'empty' }) {
  if (status === 'right') {
    return <h1>That's right!</h1>;
  }

  return (
    <>
      <h2>Capital quiz</h2>
      <p>What is the capital of France?</p>
      <input disabled={status === 'checking'} />
      <button disabled={status === 'empty' || status === 'checking'}>Check</button>
      {status === 'checking' && <p>Checking...</p>}
      {status === 'wrong' && <p>Not quite. Try again!</p>}
    </>
  );
}
