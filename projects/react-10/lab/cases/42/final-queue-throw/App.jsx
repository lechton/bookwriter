import { useActionState } from 'react';

async function signup(previousState, formData) {
  console.log('signup starts, previousState: ' + JSON.stringify(previousState));
  await new Promise(resolve => setTimeout(resolve, 1000));
  throw new Error('Network failed');
}

export default function Newsletter() {
  const [message, signupAction, isPending] = useActionState(signup, null);

  return (
    <form action={signupAction}>
      <h2>Get our weekly news</h2>
      <label>
        Email <input name="email" />
      </label>
      <button>{isPending ? 'Signing up...' : 'Sign up'}</button>
      {message && <p>{message}</p>}
    </form>
  );
}
