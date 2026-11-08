import { useState } from 'react';

export default function App() {
  const [status, setStatus] = useState('typing');

  if (status === 'sent') {
    return <p>Thanks!</p>;
  }
  return <button onClick={() => setStatus('sent')}>Send</button>;
}
