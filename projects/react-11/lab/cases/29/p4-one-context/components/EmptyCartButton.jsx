import { useContext } from 'react';
import { ShopContext } from '../CartContext.jsx';

export default function EmptyCartButton() {
  console.log('EmptyCartButton renders'); // Prints once for each render of EmptyCartButton
  const { dispatch } = useContext(ShopContext);
  return <button onClick={() => dispatch({ type: 'emptied' })}>Empty cart</button>;
}
