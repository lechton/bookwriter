import { useState } from 'react';

export default function NameBox() {
  const [firstName, setFirstName] = useState('');
  return (
    <label>
      First name
      <input value={firstName} onChange={e => setFirstName(e.target.value)} />
    </label>
  );
}
