import { useState } from 'react';

function NameBox({ firstName, onFirstNameChange }) {
  console.log('NameBox renders', JSON.stringify(firstName));
  return <input value={firstName} onChange={e => onFirstNameChange(e.target.value)} />;
}

function BadgePreview({ firstName }) {
  console.log('BadgePreview renders', JSON.stringify(firstName));
  return <h2>{firstName}</h2>;
}

export default function App() {
  const [firstName, setFirstName] = useState('');
  console.log('App renders', JSON.stringify(firstName));
  return (
    <>
      <NameBox firstName={firstName} onFirstNameChange={setFirstName} />
      <BadgePreview firstName={firstName} />
    </>
  );
}
