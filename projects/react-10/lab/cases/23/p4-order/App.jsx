import { useState } from 'react';

function ClearFirst({ onAdd }) {
  const [name, setName] = useState('');
  return (
    <p>
      <input id="a" value={name} onChange={e => setName(e.target.value)} />
      <button onClick={() => { setName(''); onAdd(name); }}>Add clear first</button>
    </p>
  );
}

function SendFirst({ onAdd }) {
  const [name, setName] = useState('');
  return (
    <p>
      <input id="b" value={name} onChange={e => setName(e.target.value)} />
      <button onClick={() => { onAdd(name); setName(''); }}>Add send first</button>
    </p>
  );
}

export default function App() {
  return (
    <>
      <ClearFirst onAdd={name => console.log('clear first received', JSON.stringify(name))} />
      <SendFirst onAdd={name => console.log('send first received', JSON.stringify(name))} />
    </>
  );
}
