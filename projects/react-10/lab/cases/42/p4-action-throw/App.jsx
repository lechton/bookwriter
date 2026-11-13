import { useActionState } from 'react';

import { signUp } from './api.js';

async function signup(previousState, formData) {
  const email = formData.get('email');
  const error = await signUp(email);
  if (error) {
    return error;
  }
  return `Thanks! ${email} is signed up.`;
}

export default function Newsletter() {
  const [message, signupAction, isPending] = useActionState(signup, null);

  return (
    <form action={signupAction}>
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
