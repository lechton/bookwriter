import { useContext } from 'react';

export default function EmptyCartButton() {
  const dispatch = useContext(CartDispatchContext); // **WRONG:** this file never imported CartDispatchContext
  return <button onClick={() => dispatch({ type: 'emptied' })}>Empty cart</button>;
}
