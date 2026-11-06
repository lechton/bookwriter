import { useState, useEffect } from 'react';

export default function App() {
  const [name, setName] = useState('John');
  useEffect(() => {
    const seen = (e) => console.log('browser input on ' + e.target.id + ': ' + JSON.stringify(e.target.value));
    document.addEventListener('input', seen, true);
    return () => document.removeEventListener('input', seen, true);
  }, []);
  return (
    <>
      <input id="A" defaultValue="John" />
      <input id="B" value="John" />
      <input id="C" value={name} onChange={e => { console.log('React onChange on C: ' + JSON.stringify(e.target.value)); setName(e.target.value); }} />
    </>
  );
}
