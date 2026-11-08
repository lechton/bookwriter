export default function GuestRow({ guest, onRemove }) {
  return (
    <li>
      {guest.name}
      <button onClick={() => onRemove(guest.id)}>Remove</button>
    </li>
  );
}
