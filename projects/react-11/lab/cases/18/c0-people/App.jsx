import { useState } from 'react';

const start = [
  { id: 1, name: 'Anna' },
  { id: 2, name: 'Ben' },
  { id: 3, name: 'Cara' }
];

export default function App() {
  const [people, setPeople] = useState(start);
  return (
    <main>
      <button onClick={() => setPeople([{ id: 4, name: 'Zoe' }, ...people])}>Add Zoe</button>
      <ul className="by-index">
        {people.map((person, index) => (
          <li key={index}><input type="checkbox" />{person.name}</li>
        ))}
      </ul>
      <ul className="by-id">
        {people.map(person => (
          <li key={person.id}><input type="checkbox" />{person.name}</li>
        ))}
      </ul>
    </main>
  );
}
