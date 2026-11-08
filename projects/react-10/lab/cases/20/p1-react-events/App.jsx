import { useState } from 'react';

export default function App() {
  const [a, setA] = useState('');
  const [b, setB] = useState('');

  return (
    <main>
      <label>
        Change box
        <textarea value={a} onChange={e => { console.log('onChange:', e.target.value); setA(e.target.value); }} />
      </label>
      <label>
        Input box
        <input value={b} onInput={e => { console.log('onInput:', e.target.value); setB(e.target.value); }} />
      </label>
      <button>Somewhere else</button>
    </main>
  );
}
