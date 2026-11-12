import { useState } from 'react';

export default function App() {
  const [drink, setDrink] = useState('coffee');
  return (
    <select value={drink} onChange={e => setDrink(e.target.value)}>
      <option value="tea">Tea</option>
      <option value="coffee">Coffee</option>
    </select>
  );
}
