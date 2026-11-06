import { useState } from 'react';

export default function App() {
  const [up, setUp] = useState('');
  const [late, setLate] = useState('');
  const [plain, setPlain] = useState('');
  return (
    <>
      <input id="up" value={up} onChange={e => setUp(e.target.value.toUpperCase())} />
      <input id="late" value={late} onChange={e => { const v = e.target.value; setTimeout(() => setLate(v), 50); }} />
      <input id="plain" value={plain} onChange={e => setPlain(e.target.value)} />
    </>
  );
}
