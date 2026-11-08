import { useState } from 'react';

export default function SubscribeBox() {
  const [email, setEmail] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  function handleEmailChange(e) {
    setEmail(e.target.value);
  }

  function handleSubscribe() {
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      if (email === 'john@example.com') {
        setIsError(true);
      } else {
        setIsSuccess(true);
      }
    }, 1500);
  }

  if (isSuccess) {
    return <h2>You are subscribed!</h2>;
  }

  return (
    <section>
      <h2>Get our weekly news</h2>
      <label>
        Your email
        <input value={email} onChange={handleEmailChange} disabled={isSending} />
      </label>
      <button onClick={handleSubscribe} disabled={isSending}>Subscribe</button>
      {isSending && <p>Subscribing...</p>}
      {isError && <p>This email is already subscribed.</p>}
    </section>
  );
}
