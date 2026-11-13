import { useState } from 'react';

export default function App() {
  const [email, setEmail] = useState();
  return (
    <label>
      Email
      <input value={email} onChange={e => setEmail(e.target.value)} />
    </label>
  );
}
