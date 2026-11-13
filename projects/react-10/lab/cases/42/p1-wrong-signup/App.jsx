import { useActionState } from 'react';

function signup() {
  return 'Thanks, you are signed up!';
}

export default function Newsletter() {
  const [message, signupAction, isPending] = useActionState(signup, null);

  return (
    <form action={signup}>
      <h2>Get our weekly news</h2>
      <label>
        Email <input name="email" />
      </label>
      <button>Sign up</button>
      {message && <p>{message}</p>}
    </form>
  );
}
