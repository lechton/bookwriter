import { useActionState, startTransition } from 'react';
import { createAccount } from './api.js';

const initialState = { message: '', username: '', email: '' };

async function signUp(previousState, formData) {
  const username = formData.get('username');
  const email = formData.get('email');
  const error = await createAccount(username);
  if (error) {
    return { message: error, username, email };
  }
  return { message: `Welcome, ${username}!`, username: '', email: '' };
}

export default function App() {
  const [state, formAction] = useActionState(signUp, initialState);

  function handleSubmit(e) {
    e.preventDefault();
    const form = e.currentTarget;
    startTransition(() => {
      formAction(new FormData(form));
    });
    form.reset();
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1>Create account</h1>
      <label>Username <input name="username" defaultValue={state.username} /></label>
      <label>Email <input name="email" defaultValue={state.email} /></label>
      <button type="submit">Create account</button>
      {state.message && <p>{state.message}</p>}
    </form>
  );
}
