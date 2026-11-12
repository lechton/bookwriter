import { useState } from 'react';

function NameBox({ onAdd }) {
  const [name, setName] = useState('');
  return (
    <>
      <input value={name} onChange={e => setName(e.target.value)} />
      <button onClick={() => onAdd(name)}>Add</button>
    </>
  );
}

export default function App() {
  return <NameBox onAdd={name => console.log(name)} />;
}
