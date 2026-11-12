import { useState } from 'react';

function useName() {
  const [name, setName] = useState('');
  return [name, setName];
}

function NameBox() {
  const [name, setName] = useName();
  return <input value={name} onChange={e => setName(e.target.value)} />;
}

function BadgePreview() {
  const [name] = useName();
  return <h2>{name}</h2>;
}

export default function App() {
  return (
    <>
      <NameBox />
      <BadgePreview />
    </>
  );
}
