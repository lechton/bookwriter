import { useState } from 'react';

export default function CouponBox() {
  const [code, setCode] = useState('');
  const [status, setStatus] = useState('typing');

  function handleApply() {
    setStatus('checking');
    setTimeout(() => {
      if (code === 'SAVE10') {
        setStatus('applied');
      } else {
        setStatus('error');
      }
    }, 1000);
  }

  if (status === 'applied') {
    return <p className="success">SAVE10 applied. You save 10%.</p>;
  }

  return (
    <section>
      <label>
        Coupon code
        <input value={code} onChange={e => setCode(e.target.value)} disabled={status === 'checking'} />
      </label>
      <button onClick={handleApply} disabled={code.length === 0 || status === 'checking'}>Apply</button>
      {status === 'checking' && <p>Checking...</p>}
      {status === 'error' && <p className="error">This code is not valid.</p>}
    </section>
  );
}
