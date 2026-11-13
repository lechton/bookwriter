import { useActionState } from 'react';
import { createAccount } from './api.js';

const initialState = { message: '', username: '', email: '' };

async function signUp(previousState, formData) {
  const username = formData.get('username');
  const email = formData.get('email');
  const error = await createAccount(username);
  if (error) {
    return { message: error, username, email }; // Principle 2: returned, not thrown
  }
  return { message: `Welcome, ${username}!`, username: '', email: '' };
}

export default function App() {
  const [state, formAction] = useActionState(signUp, initialState);

  return (
    <form action={formAction}> {/* Principle 1: React resets the form after signUp returns */}
      <h1>Create account</h1>
      <label>Username <input name="username" defaultValue={state.username} /></label> {/* Principle 5: a name the browser can send */}
      <label>Email <input name="email" defaultValue={state.email} /></label> {/* Principle 3: the reset puts back the typed email */}
      <button type="submit">Create account</button> {/* Principle 5: a real submit button */}
      {state.message && <p>{state.message}</p>}
    </form>
  );
}
