import { useState } from 'react';

function Quiz() {
  const [status, setStatus] = useState('asking');

  if (status === 'right') {
    return <h1>That's right!</h1>;
  }
  return <button onClick={() => setStatus('right')}>Paris</button>;
}

export default function App() {
  return <Quiz />;
}
