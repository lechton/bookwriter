import { useState } from 'react';

export default function AddGuest({ onAdd }) {
  const [name, setName] = useState('');
  console.log('AddGuest');

  return (
    <>
      <input
        placeholder="Guest name"
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <button onClick={() => {
        setName('');
        onAdd(name);
      }}>Add</button>
    </>
  );
}
