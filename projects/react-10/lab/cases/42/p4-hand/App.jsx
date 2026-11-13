import { useState } from 'react';
import { signUp } from './api.js';

export default function Newsletter() {
  const [message, setMessage] = useState(null);
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    const email = new FormData(e.target).get('email');
    setIsPending(true);
    const error = await signUp(email);
    setMessage(error ? error : `Thanks! ${email} is signed up.`);
    setIsPending(false);
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Get our weekly news</h2>
      <label>
        Email <input name="email" />
      </label>
      <button disabled={isPending}>
        {isPending ? 'Signing up...' : 'Sign up'}
      </button>
      {message && <p>{message}</p>}
    </form>
  );
}
