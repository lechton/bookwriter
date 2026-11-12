export default function PromoCode({ status = 'success' }) {
  if (status === 'success') {
    return <p>Code applied! You get free delivery.</p>;
  }
  return (
    <form>
      <h2>Promo code</h2>
      <input disabled={status === 'checking'} />
      <button disabled={status === 'empty' || status === 'checking'}>Apply</button>
      {status === 'checking' && <p>Checking...</p>}
      {status === 'error' && <p className="error">This code is not valid.</p>}
    </form>
  );
}
