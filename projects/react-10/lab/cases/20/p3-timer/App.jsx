import { useState } from 'react';

export default function App() {
  const [name, setName] = useState('');

  function handleNameChange(e) {
    setTimeout(() => setName(e.target.value), 100);
  }

  return (
    <label>
      Name
      <input value={name} onChange={handleNameChange} />
    </label>
  );
}
