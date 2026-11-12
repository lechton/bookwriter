import { useState } from 'react';

export default function CouponBox() {
  const [code, setCode] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [isChecking, setIsChecking] = useState(false);
  const [isApplied, setIsApplied] = useState(false);
  const [isError, setIsError] = useState(false);

  function handleApply() {
    setIsChecking(true);
    setTimeout(() => {
      setIsChecking(false);
      if (code === 'SAVE10') {
        setIsApplied(true);
      } else {
        setIsError(true);
      }
    }, 1000);
  }

  return (
    <section>
      <label>
        Coupon code
        <input value={code} onChange={e => setCode(e.target.value)} disabled={isChecking} />
      </label>
      <button onClick={handleApply} disabled={code.length === 0 || isChecking}>Apply</button>
      {isChecking && <p>Checking...</p>}
      {isError && <p className="error">This code is not valid.</p>}
      {isApplied && <p className="success">SAVE10 applied. You save 10%.</p>}
    </section>
  );
}
