import { useState } from 'react';
import GuestRow from './GuestRow.jsx';

const initialGuests = [
  { id: 0, name: 'John' },
  { id: 1, name: 'Mia' },
  { id: 2, name: 'Sara' },
];

export default function GuestList() {
  const [guests, setGuests] = useState(initialGuests);
  console.log('GuestList renders with', guests.map(g => g.name).join(', ') || 'nobody');

  function handleRemove(id) {
    console.log('handleRemove', id, '->', guests.filter(guest => guest.id !== id).map(g => g.name).join(', ') || 'nobody');
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
