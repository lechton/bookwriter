import { useState } from 'react';
import GuestRow from './GuestRow.jsx';

const initialGuests = [
  { id: 0, name: 'John' },
  { id: 1, name: 'Mia' },
  { id: 2, name: 'Sara' },
];

export default function GuestList() {
  const [guests, setGuests] = useState(initialGuests);

  function handleRemove(id) {
    setGuests(guests.filter(guest => guest.id !== id));
  }

  return (
    <section>
      <h1>Party Guests</h1>
      <p>{guests.length} guests</p>
      <ul>
        {guests.map(guest => (
          <GuestRow
            key={guest.id}
            guest={guest}
            onRemove={handleRemove(guest.id)}
          />
        ))}
      </ul>
    </section>
  );
}
