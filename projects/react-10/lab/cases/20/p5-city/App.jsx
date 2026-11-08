import { useState } from 'react';

export default function App() {
  const [city, setCity] = useState();

  return (
    <label>
      City
      <input value={city} onChange={e => setCity(e.target.value)} />
    </label>
  );
}
