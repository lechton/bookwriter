import CouponBox from './components/CouponBox.jsx';

const statuses = ['empty', 'typing', 'checking', 'applied', 'error'];

export default function App() {
  return (
    <main>
      <h1>Checkout</h1>
      {statuses.map(status => (
        <div key={status}>
          <h2>{status}</h2>
          <CouponBox status={status} />
        </div>
      ))}
    </main>
  );
}
