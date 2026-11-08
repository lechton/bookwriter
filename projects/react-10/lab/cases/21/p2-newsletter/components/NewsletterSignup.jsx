import { useState } from 'react';

export default function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('typing');

  function handleSubmit(e) {
    e.preventDefault();
    if (email.includes('@')) {
      setStatus('submitting');
      setTimeout(() => {
        setStatus('success');
      }, 1000);
    } else {
      setStatus('error');
    }
  }

  if (status === 'success') {
    return <p>Welcome to the list!</p>;
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Join our newsletter</h2>
      <input
        value={email}
        onChange={e => setEmail(e.target.value)}
        disabled={status === 'submitting'}
      />
      <button type="submit" disabled={email.length === 0 || status === 'submitting'}>
        Join
      </button>
      {status === 'submitting' && <p>Sending...</p>}
      {status === 'error' && <p style={{ color: 'red' }}>Please enter a full email address.</p>}
    </form>
  );
}
