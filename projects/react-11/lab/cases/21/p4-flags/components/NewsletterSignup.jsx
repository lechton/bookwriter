import { useState } from 'react';

export default function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [isError, setIsError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    if (email.includes('@')) {
      setIsSubmitting(true);
      setTimeout(() => {
        setIsSubmitting(false);
        setIsSuccess(true);
      }, 1000);
    } else {
      setIsError(true);
    }
  }

  if (isSuccess) {
    return <p>Welcome to the list!</p>;
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Join our newsletter</h2>
      <input value={email} onChange={e => setEmail(e.target.value)} disabled={isSubmitting} />
      <button type="submit" disabled={email.length === 0 || isSubmitting}>Join</button>
      {isSubmitting && <p>Sending...</p>}
      {isError && <p style={{ color: 'red' }}>Please enter a full email address.</p>}
    </form>
  );
}
