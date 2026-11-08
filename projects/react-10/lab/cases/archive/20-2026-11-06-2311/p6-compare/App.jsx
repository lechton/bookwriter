import { useState } from 'react';

export default function App() {
  const [city, setCity] = useState();
  const [street, setStreet] = useState('');
  return (
    <>
      <input id="city" value={city} onChange={e => setCity(e.target.value)} />
      <input id="street" value={street} onChange={e => setStreet(e.target.value)} />
    </>
  );
}
