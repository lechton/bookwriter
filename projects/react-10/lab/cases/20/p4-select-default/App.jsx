export default function App() {
  return (
    <label>
      Topic
      <select defaultValue="payment">
        <option value="delivery">Delivery</option>
        <option value="payment">Payment</option>
        <option value="other">Other</option>
      </select>
    </label>
  );
}
