import { useState } from 'react';

export default function App() {
  const [name, setName] = useState('John');
  return (
    <>
      <input defaultValue="John" />
      <input value="John" />
      <input value={name} onChange={e => setName(e.target.value)} />
      <button onClick={() => setName('')}>Clear</button>
      <p>name in state: {JSON.stringify(name)}</p>
    </>
  );
}
