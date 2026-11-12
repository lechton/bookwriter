import { useState } from 'react';

export default function App() {
  const [name, setName] = useState('');

  return (
    <label>
      Name
      <input value={name} onChange={e => setName(e.target.value.toUpperCase())} />
    </label>
  );
}
