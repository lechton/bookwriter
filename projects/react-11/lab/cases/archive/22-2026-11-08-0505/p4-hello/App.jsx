import { useState } from 'react';

function HelloCopied({ name }) {
  const [shownName] = useState(name);
  return <p>Copied: Hello, {shownName}</p>;
}

function HelloDirect({ name }) {
  return <p>Direct: Hello, {name}</p>;
}

export default function App() {
  const [name, setName] = useState('John');
  return (
    <main>
      <HelloCopied name={name} />
      <HelloDirect name={name} />
      <button onClick={() => setName('Mia')}>Pass Mia</button>
    </main>
  );
}
