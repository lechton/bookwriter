import { useState } from 'react';

export default function App() {
  const [status, setStatus] = useState('typing');

  function handleSend() {
    setStatus('sending');
    setTimeout(() => {
      setStatus('sent');
    }, 1000);
  }

  if (status === 'sent') {
    return <p>Thanks!</p>;
  }
  return (
    <section>
      <button onClick={handleSend} disabled={status === 'sending'}>Send</button>
      {status === 'sending' && <p>Sending...</p>}
    </section>
  );
}
