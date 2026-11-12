import { useContext } from 'react';
import { ShopContext } from '../CartContext.jsx';

export default function CartRow({ item }) {
  const { dispatch } = useContext(ShopContext); // The dispatch that App got from useReducer
  return (
    <li>
      {item.name}: {item.quantity}
      <button onClick={() => dispatch({ type: 'increased', id: item.id })}>Add one</button>
      <button onClick={() => dispatch({ type: 'decreased', id: item.id })}>Remove one</button>
      <button onClick={() => dispatch({ type: 'deleted', id: item.id })}>Delete</button>
    </li>
  );
}
