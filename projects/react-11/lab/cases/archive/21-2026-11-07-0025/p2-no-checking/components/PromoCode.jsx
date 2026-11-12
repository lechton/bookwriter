import { useState } from 'react';
import { checkCode } from '../checkCode.js';

export default function PromoCode() {
  const [code, setCode] = useState('');
  const [status, setStatus] = useState('typing');

  if (status === 'success') {
    return <p>Code applied! You get free delivery.</p>;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await checkCode(code);
      setStatus('success');
    } catch {
      setStatus('error');
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Promo code</h2>
      <input value={code} onChange={e => setCode(e.target.value)} />
      <button disabled={code.length === 0}>Apply</button>
      {status === 'error' && <p className="error">This code is not valid.</p>}
    </form>
  );
}
