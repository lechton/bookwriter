import { useState } from 'react';
import { checkCode } from '../checkCode.js';

export default function PromoCode() {
  const [code, setCode] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setIsChecking(true);
    try {
      await checkCode(code);
      setIsSuccess(true);
    } catch {
      setIsError(true);
    }
  }

  if (isSuccess) {
    return <p>Code applied! You get free delivery.</p>;
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Promo code</h2>
      <input value={code} onChange={e => setCode(e.target.value)} disabled={isChecking} />
      <button disabled={code.length === 0 || isChecking}>Apply</button>
      {isChecking && <p>Checking...</p>}
      {isError && <p className="error">This code is not valid.</p>}
    </form>
  );
}
