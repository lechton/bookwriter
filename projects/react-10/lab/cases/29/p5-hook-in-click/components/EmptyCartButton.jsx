import { useCartDispatch } from '../CartContext.jsx';

export default function EmptyCartButton() {
  return <button onClick={() => useCartDispatch()({ type: 'emptied' })}>Empty cart</button>; // **WRONG:** a Hook called inside a click handler
}
