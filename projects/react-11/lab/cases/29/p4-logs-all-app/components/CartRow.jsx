import { useContext } from 'react';
import { CartDispatchContext } from '../CartContext.jsx';

export default function CartRow({ item }) {
  console.log('CartRow renders');
  const dispatch = useContext(CartDispatchContext); // The dispatch that App got from useReducer
  return (
    <li>
      {item.name}: {item.quantity}
      <button onClick={() => dispatch({ type: 'increased', id: item.id })}>Add one</button>
      <button onClick={() => dispatch({ type: 'decreased', id: item.id })}>Remove one</button>
      <button onClick={() => dispatch({ type: 'deleted', id: item.id })}>Delete</button>
    </li>
  );
}
