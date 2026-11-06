import { useState } from 'react';

export default function App() {
  const [a, setA] = useState('');
  const [b, setB] = useState('');
  const [c, setC] = useState('');
  return (
    <>
      <input value={a} onChange={e => setA(e.target.value)} />
      <input value={b} onChange={e => setB(e.target.value.trim())} />
      <input value={c} onChange={e => { if (e.target.value.length <= 5) setC(e.target.value); }} />
    </>
  );
}
