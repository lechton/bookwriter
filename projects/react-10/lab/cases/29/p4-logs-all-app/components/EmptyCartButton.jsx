import { useContext } from 'react';
import { CartDispatchContext } from '../CartContext.jsx';

export default function EmptyCartButton() {
  console.log('EmptyCartButton renders');
  const dispatch = useContext(CartDispatchContext);
  return <button onClick={() => dispatch({ type: 'emptied' })}>Empty cart</button>; // Sends its own action
}
