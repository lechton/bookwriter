import { useState } from 'react';

export default function App() {
  const [email, setEmail] = useState(null);
  const [agree, setAgree] = useState();
  return (
    <>
      <input type="email" value={email ?? ''} onChange={e => setEmail(e.target.value)} />
      <input type="checkbox" checked={agree} onChange={e => setAgree(e.target.checked)} />
    </>
  );
}
