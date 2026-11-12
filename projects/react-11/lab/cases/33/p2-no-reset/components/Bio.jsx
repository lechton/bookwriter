import { useState, useEffect } from 'react';

export default function Bio({ person }) {
  const [bio, setBio] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    setBio(null);
    fetch('/api/bio/' + person)
      .then(response => {
        if (!response.ok) {
          throw new Error('Status ' + response.status);
        }
        return response.json();
      })
      .then(data => setBio(data.bio))
      .catch(err => setError(err));
  }, [person]);

  if (error) {
    return <p>Could not load the bio.</p>;
  }
  return <p>{bio ?? 'Loading...'}</p>;
}
