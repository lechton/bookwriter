import { useState } from 'react';

export default function GuestRow({ guest }) {
  const [isRemoved, setIsRemoved] = useState(false);
  if (isRemoved) return null;

  return (
    <li>
      {guest.name}
      <button onClick={() => setIsRemoved(true)}>Remove</button>
    </li>
  );
}
