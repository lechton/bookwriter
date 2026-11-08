import { useState } from 'react';

export default function SubscribeBox() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('typing');

  function handleEmailChange(e) {
    setEmail(e.target.value);
    setStatus('typing');
  }

  function handleSubscribe() {
    setStatus('sending');
    setTimeout(() => {
      if (email === 'john@example.com') {
        setStatus('error');
      } else {
        setStatus('success');
      }
    }, 1500);
  }

  if (status === 'success') {
    return <h2>You are subscribed!</h2>;
  }

  return (
    <section>
      <h2>Get our weekly news</h2>
      <label>
        Your email
        <input
          value={email}
          onChange={handleEmailChange}
          disabled={status === 'sending'}
          className={status === 'error' ? 'invalid' : ''}
        />
      </label>
      <button onClick={handleSubscribe} disabled={status === 'sending'}>Subscribe</button>
      {status === 'sending' && <p>Subscribing...</p>}
      {status === 'error' && <p>This email is already subscribed.</p>}
    </section>
  );
}
