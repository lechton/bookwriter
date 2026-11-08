export default function CouponBox({ status = 'error' }) {
  if (status === 'applied') {
    return <p className="success">SAVE10 applied. You save 10%.</p>;
  }

  return (
    <section>
      <label>
        Coupon code
        <input disabled={status === 'checking'} />
      </label>
      <button disabled={status === 'empty' || status === 'checking'}>Apply</button>
      {status === 'checking' && <p>Checking...</p>}
      {status === 'error' && <p className="error">This code is not valid.</p>}
    </section>
  );
}
