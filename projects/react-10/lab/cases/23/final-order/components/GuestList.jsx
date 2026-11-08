import { useState } from 'react';
import AddGuest from './AddGuest.jsx';
import GuestRow from './GuestRow.jsx';

const initialGuests = [
  { id: 0, name: 'John' },
  { id: 1, name: 'Mia' },
  { id: 2, name: 'Sara' },
];

let nextId = 3;

export default function GuestList() {
  const [guests, setGuests] = useState(initialGuests);
  console.log('GuestList');

  function handleRemove(id) {
    setGuests(guests.filter(guest => guest.id !== id));
  }

  function handleAdd(name) {
    setGuests([...guests, { id: nextId++, name: name }]);
  }

  return (
    <section>
      <h1>Party Guests</h1>
      <AddGuest onAdd={handleAdd} />
      <p>{guests.length} guests</p>
      <ul>
        {guests.map(guest => (
          <GuestRow
            key={guest.id}
            guest={guest}
            onRemove={handleRemove}
          />
        ))}
      </ul>
    </section>
  );
}
