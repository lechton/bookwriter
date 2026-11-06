import { useState } from 'react';

export default function Subscribe() {
  const [done, setDone] = useState(false);
  return (
    <>
      <button disabled={done} onClick={() => setDone(true)}>Subscribe</button>
      {done && <p>Thanks!</p>}
    </>
  );
}
