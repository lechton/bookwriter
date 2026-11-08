import { useState } from 'react';

function Row({ id, onRemove }) {
  return <button onClick={() => onRemove(id)}>Remove</button>;
}

export default function App() {
  const [names, setNames] = useState([{ id: 1, name: 'John' }, { id: 2, name: 'Mia' }]);

  function handleRemove(id) {
    setNames(names.filter(n => n.id !== id));
  }

  return (
    <div>
      <p>{names.map(n => n.name).join(', ')}</p>
      <Row id={2} onRemove={handleRemove} />
    </div>
  );
}
