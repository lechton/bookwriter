import { useState } from 'react';

export default function CaptainLine({ name }) {
  const [shownName] = useState(name);
  return <p>Captain: {shownName}</p>;
}
