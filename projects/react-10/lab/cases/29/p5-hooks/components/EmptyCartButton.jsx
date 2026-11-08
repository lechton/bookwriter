import { useCartDispatch } from '../CartContext.jsx';

export default function EmptyCartButton() {
  const dispatch = useCartDispatch();
  return <button onClick={() => dispatch({ type: 'emptied' })}>Empty cart</button>;
}
