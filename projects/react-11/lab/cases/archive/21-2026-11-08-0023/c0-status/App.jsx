import { useState } from 'react';

export default function App() {
  const [status, setStatus] = useState('typing');
  return (
    <>
      <button onClick={() => setStatus('error')}>first try</button>
      <button onClick={() => setStatus('success')}>second try</button>
      {status === 'error' && <p>This email is already subscribed.</p>}
      {status === 'success' && <p>You are subscribed!</p>}
    </>
  );
}
