import { useState } from 'react';

export default function PromoCode() {
  const [code, setCode] = useState('');
  const [status, setStatus] = useState('typing');

  if (status === 'success') {
    return <p>Code applied! You get free delivery.</p>;
  }

  return (
    <form>
      <h2>Promo code</h2>
      <input value={code} onChange={e => setCode(e.target.value)} disabled={status === 'checking'} />
      <button disabled={code.length === 0 || status === 'checking'}>Apply</button>
      {status === 'checking' && <p>Checking...</p>}
      {status === 'error' && <p className="error">This code is not valid.</p>}
    </form>
  );
}
