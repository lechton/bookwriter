import { useState } from 'react';

export default function CaptainLine({ name }) {
  const [shownName] = useState(name); // **WRONG:** reads name once on the first render and ignores later name props
  return <p>Captain: {shownName}</p>;
}
