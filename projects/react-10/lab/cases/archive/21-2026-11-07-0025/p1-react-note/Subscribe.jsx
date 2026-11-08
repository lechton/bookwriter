import { useState } from 'react';

export default function Subscribe() {
  const [done, setDone] = useState(false);
  return (
    <>
      <button disabled={done} onClick={() => setDone(true)}>Subscribe</button>
      {!done && <p>Get one email a week</p>}
      {done && <p>Thanks!</p>}
    </>
  );
}
