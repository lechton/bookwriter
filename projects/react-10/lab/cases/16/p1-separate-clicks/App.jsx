import { useState } from 'react';

export default function App() {
  const [count, setCount] = useState(0);
  const [sent, setSent] = useState(false);
  const [sends, setSends] = useState(0);

  function handleSubmit(event) {
    event.preventDefault();
    setSent(true);
    setSends(sends + 1);
  }

  return (
    <>
      <button className="count" onClick={() => setCount(count + 1)}>Count: {count}</button>
      <form onSubmit={handleSubmit}>
        <button className="submit" type="submit" disabled={sent}>Submit</button>
      </form>
      <p>Sends: {sends}</p>
    </>
  );
}
