import { useState } from 'react';

function WayA() {
  const [names, setNames] = useState(['Cara', 'Anna', 'Ben']);

  function handleAdd() {
    names.push('Dan');
    setNames(names);
  }

  return (
    <section className="a">
      <h2>Way A</h2>
      <ul>{names.map(name => <li key={name}>{name}</li>)}</ul>
      <button onClick={handleAdd}>Add Dan with push</button>
    </section>
  );
}

function WayB() {
  const [names, setNames] = useState(['Cara', 'Anna', 'Ben']);

  function handleAdd() {
    setNames([...names, 'Dan']);
  }

  return (
    <section className="b">
      <h2>Way B</h2>
      <ul>{names.map(name => <li key={name}>{name}</li>)}</ul>
      <button onClick={handleAdd}>Add Dan with spread</button>
    </section>
  );
}

export default function App() {
  return (
    <main>
      <WayA />
      <WayB />
    </main>
  );
}
