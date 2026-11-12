import { useContext } from 'react';
import { CartDispatchContext } from '../CartContext.jsx';

export default function EmptyCartButton() {
  console.log('EmptyCartButton renders'); // Prints once for each render of EmptyCartButton
  const dispatch = useContext(CartDispatchContext);
  return <button onClick={() => dispatch({ type: 'emptied' })}>Empty cart</button>;
}
