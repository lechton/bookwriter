import { useState } from 'react';

function HelloState({ name }) {
  const [shownName] = useState(name);
  return <p>Hello, {shownName}</p>;
}

function HelloDirect({ name }) {
  return <p>Hello, {name}</p>;
}

export default function App() {
  const [name, setName] = useState('John');
  return (
    <main>
      <HelloState name={name} />
      <HelloDirect name={name} />
      <button onClick={() => setName('Mia')}>Pass Mia</button>
    </main>
  );
}
