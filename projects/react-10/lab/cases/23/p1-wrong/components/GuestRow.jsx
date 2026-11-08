export default function GuestRow({ guest }) {
  return (
    <li>
      {guest.name}
      <button onClick={() => setGuests(guests.filter(g => g.id !== guest.id))}>Remove</button>
    </li>
  );
}
