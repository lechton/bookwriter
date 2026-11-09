import { useState, useEffect } from 'react';

export default function Bio({ person }) {
  const [bio, setBio] = useState(null);

  useEffect(() => {
    setBio(null);
    fetch('/api/bio/' + person)
      .then(response => response.json())
      .then(data => setBio(data.bio));
  }, []);

  return <p>{bio ?? 'Loading...'}</p>;
}
