import { useActionState } from 'react';

function signup(previousState, formData) {
  const email = formData.get('email');
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
      <button>Sign up</button>
      {message && <p>{message}</p>}
    </form>
  );
}
