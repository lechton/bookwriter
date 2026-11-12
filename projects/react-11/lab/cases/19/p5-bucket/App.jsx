import { useState } from 'react';

const initialList = [
  { id: 0, title: 'Big Bellies', seen: false },
  { id: 1, title: 'Lunar Landscape', seen: false },
];

export default function App() {
  const [myList, setMyList] = useState(initialList);
  const [yourList, setYourList] = useState(initialList);

  function handleToggleMyList(index) {
    const next = [...myList];
    next[index].seen = !next[index].seen;
    setMyList(next);
  }

  return (
    <main>
      <h2>My list</h2>
      <ul className="mine">
        {myList.map((art, index) => (
          <li key={art.id}>
            <label>
              <input type="checkbox" checked={art.seen} onChange={() => handleToggleMyList(index)} />
              {art.title}
            </label>
          </li>
        ))}
      </ul>
      <h2>Your list</h2>
      <ul className="yours">
        {yourList.map(art => (
          <li key={art.id}>
            <label>
              <input type="checkbox" checked={art.seen} onChange={() => setYourList(yourList)} />
              {art.title}
            </label>
          </li>
        ))}
      </ul>
    </main>
  );
}
