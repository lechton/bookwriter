import { useState } from 'react';

export default function App() {
  const [city, setCity] = useState('');

  return (
    <main>
      <label>
        City
        <input value={city} onChange={e => setCity(e.target.value)} />
      </label>
      <button onClick={() => setCity(undefined)}>Clear</button>
    </main>
  );
}
