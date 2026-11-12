import { useState } from 'react';

export default function App() {
  const [name, setName] = useState('John');

  return (
    <label>
      Name
      <input value={name} />
    </label>
  );
}
