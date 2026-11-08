import { useState } from 'react';

export default function App() {
  const [name, setName] = useState('');

  return (
    <main>
      <label>
        Name
        <input onChange={e => setName(e.target.value)} />
      </label>
      <p>Hello, {name}</p>
    </main>
  );
}
