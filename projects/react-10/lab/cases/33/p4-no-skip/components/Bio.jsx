import { useState, useEffect } from 'react';

export default function Bio({ person }) {
  const [bio, setBio] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    setBio(null);
    setError(null);
    fetch('/api/bio/' + person, { signal: controller.signal })
      .then(response => {
        if (!response.ok) {
          throw new Error('Status ' + response.status);
        }
        return response.json();
      })
      .then(data => setBio(data.bio))
      .catch(err => setError(err));
    return () => controller.abort();
  }, [person]);

  if (error) {
    return <p>Could not load the bio.</p>;
  }
  return <p>{bio ?? 'Loading...'}</p>;
}
