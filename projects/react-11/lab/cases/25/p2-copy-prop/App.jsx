import { useState } from 'react';

const contacts = [
  { id: 1, name: 'Taylor' },
  { id: 2, name: 'Alice' },
];

function EditContact({ initialData }) {
  const [name, setName] = useState(initialData.name);
  return <input value={name} onChange={e => setName(e.target.value)} />;
}

export default function App() {
  const [selected, setSelected] = useState(contacts[0]);
  return (
    <main>
      {contacts.map(c => (
        <button key={c.id} onClick={() => setSelected(c)}>{c.name}</button>
      ))}
      <p>Editing: {selected.name}</p>
      <EditContact initialData={selected} />
    </main>
  );
}
