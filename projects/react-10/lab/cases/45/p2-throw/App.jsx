import { useActionState } from 'react';
import { createAccount } from './api.js';

async function signUp(previousState, formData) {
  const username = formData.get('username');
  const error = await createAccount(username);
  if (error) {
    throw new Error(error);
  }
  return `Welcome, ${username}!`;
}

export default function App() {
  const [message, formAction] = useActionState(signUp, '');

  return (
    <form action={formAction}>
      <h1>Create account</h1>
      <label>Username <input name="username" /></label>
      <label>Email <input name="email" /></label>
      <button type="submit">Create account</button>
      {message && <p>{message}</p>}
    </form>
  );
}
