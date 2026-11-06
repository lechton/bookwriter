import { useState } from 'react';

export default function App() {
  const [name] = useState('John');
  return (
    <>
      <input value="John" />
      <input value={name} />
    </>
  );
}
