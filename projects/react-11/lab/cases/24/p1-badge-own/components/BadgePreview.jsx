import { useState } from 'react';

export default function BadgePreview() {
  const [firstName, setFirstName] = useState('');
  return (
    <>
      <p>Hello, my name is</p>
      <h2>{firstName}</h2>
    </>
  );
}
