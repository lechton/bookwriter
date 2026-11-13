import { useActionState } from 'react';
import { createAccount } from './api.js';

const initialState = { message: '', username: '', email: '' };

async function signUp(previousState, formData) {
  const username = formData.get('username');
  const email = formData.get('email');
  const error = await createAccount(username);
  if (error) {
    return { message: error, username, email }; // Keeps what the user typed
  }
  return { message: `Welcome, ${username}!`, username: '', email: '' }; // Empties both boxes
}

export default function App() {
  const [state, formAction] = useActionState(signUp, initialState);

  return (
    <form action={formAction}>
      <h1>Create account</h1>
      <label>Username <input name="username" defaultValue={state.username} /></label>
      <label>Email <input name="email" defaultValue={state.email} /></label>
      <button type="submit">Create account</button>
      {state.message && <p>{state.message}</p>}
    </form>
  );
}
