import { useState, useEffect } from 'react';

export default function Bio({ person }) {
  const [bio, setBio] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false;
    setBio(null);
    setError(null);
    fetch('/api/bio/' + person)
      .then(response => {
        if (!response.ok) {
          throw new Error('Status ' + response.status);
        }
        return response.json();
      })
      .then(data => { if (!ignore) setBio(data.bio); })
      .catch(err => { if (!ignore) setError(err); });
    return () => {
      ignore = true;
    };
  }, [person]);

  if (error) {
    return <p>Could not load the bio.</p>;
  }
  return <p>{bio ?? 'Loading...'}</p>;
}
