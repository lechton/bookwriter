import { useState, useRef } from 'react';

let nextId = 0;

export default function GuestList({ title }) {
  const [text, setText] = useState('');
  const [guests, setGuests] = useState([]);
  const inputRef = useRef(null);

  function handleAdd() {
    setGuests([...guests, { id: nextId++, name: text }]);
    setText('');
    document.getElementById('guest-input').focus();
  }

  return (
    <section>
      <h2>{title} guests</h2>
      <input id="guest-input" value={text} onChange={e => setText(e.target.value)} />
      <button onClick={handleAdd}>Add</button>
      <ul>
        {guests.map(guest => <li key={guest.id}>{guest.name}</li>)}
      </ul>
    </section>
  );
}
