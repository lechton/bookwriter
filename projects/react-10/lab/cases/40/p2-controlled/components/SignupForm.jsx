import { useState } from 'react';

export default function SignupForm() {
  const [email, setEmail] = useState('');
  console.log('SignupForm rendered');
  function handleSubmit(e) {
    e.preventDefault();
    console.log(email);
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Sign up</h2>
      <label>
        Email
        <input value={email} onChange={e => setEmail(e.target.value)} />
      </label>
      <button type="submit">Sign up</button>
    </form>
  );
}
