import { useState } from 'react';

export default function App() {
  const [likes, setLikes] = useState(0);
  function NameField() {
    const [name, setName] = useState('');
    return <input value={name} onChange={e => setName(e.target.value)} />;
  }
  return (
    <main>
      <NameField />
      <button onClick={() => setLikes(likes + 1)}>Likes: {likes}</button>
    </main>
  );
}
