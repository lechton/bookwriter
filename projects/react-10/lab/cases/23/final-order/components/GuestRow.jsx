export default function GuestRow({ guest, onRemove }) {
  console.log('GuestRow', guest.name);
  return (
    <li>
      {guest.name}
      <button onClick={() => onRemove(guest.id)}>Remove</button>
    </li>
  );
}
