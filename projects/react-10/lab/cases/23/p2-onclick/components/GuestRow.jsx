export default function GuestRow({ guest, onRemove }) {
  return (
    <li>
      {guest.name}
      <button onClick={onRemove}>Remove</button>
    </li>
  );
}
