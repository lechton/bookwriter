export default function EmptyCartButton({ onEmpty }) {
  return <button onClick={onEmpty}>Empty cart</button>; // The handler that came down from App through CartPage
}
