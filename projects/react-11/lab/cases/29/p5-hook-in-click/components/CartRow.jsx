import { useCartDispatch } from '../CartContext.jsx';

export default function CartRow({ item }) {
  const dispatch = useCartDispatch(); // Principle 5: reads dispatch
  return (
    <li>
      {item.name}: {item.quantity}
      <button onClick={() => dispatch({ type: 'increased', id: item.id })}>Add one</button>
      <button onClick={() => dispatch({ type: 'decreased', id: item.id })}>Remove one</button>
      <button onClick={() => dispatch({ type: 'deleted', id: item.id })}>Delete</button>
    </li>
  );
}
