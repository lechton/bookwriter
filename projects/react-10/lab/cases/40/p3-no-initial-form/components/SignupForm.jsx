import { useState } from 'react';

export default function SignupForm() {
  const [password, setPassword] = useState();
  console.log('SignupForm rendered');

  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email');
    console.log({ email, password });
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Sign up</h2>
      <label>
        Email
        <input name="email" />
      </label>
      <label>
        Password
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
      </label>
      <p>{password.length < 8 ? 'Use 8 or more characters' : 'Looks good'}</p>
      <button type="submit">Sign up</button>
    </form>
  );
}
