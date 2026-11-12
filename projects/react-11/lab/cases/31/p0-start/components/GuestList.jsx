import { useState } from 'react';

let nextId = 0;

export default function GuestList() {
  const [text, setText] = useState('');
  const [guests, setGuests] = useState([]);

  function handleAdd() {
    setGuests([...guests, { id: nextId++, name: text }]);
    setText('');
  }

  return (
    <section>
      <h2>Lunch guests</h2>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={handleAdd}>Add</button>
      <ul>
        {guests.map(guest => <li key={guest.id}>{guest.name}</li>)}
      </ul>
    </section>
  );
}
