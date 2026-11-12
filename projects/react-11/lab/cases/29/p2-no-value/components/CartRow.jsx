export default function CartRow({ item, onIncrease, onDecrease, onDelete }) {
  return (
    <li>
      {item.name}: {item.quantity}
      <button onClick={() => onIncrease(item.id)}>Add one</button>
      <button onClick={() => onDecrease(item.id)}>Remove one</button>
      <button onClick={() => onDelete(item.id)}>Delete</button> {/* The handler that came down from App */}
    </li>
  );
}
