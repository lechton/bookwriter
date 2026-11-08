import { useState } from 'react';

function Signup() {
  const [status, setStatus] = useState('typing');
  if (status === 'success') {
    return <p>Welcome to the list!</p>;
  }
  return <button onClick={() => setStatus('success')}>Join</button>;
}

export default function App() {
  return <Signup />;
}
