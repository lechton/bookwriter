import { useState } from 'react';

export default function Bio({ person }) {
  const [bio, setBio] = useState(null);

  return <p>{bio ?? 'Loading...'}</p>;
}
