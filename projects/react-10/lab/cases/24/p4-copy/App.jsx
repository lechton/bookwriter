import { useState } from 'react';
import NameBox from './components/NameBox.jsx';
import BadgePreview from './components/BadgePreview.jsx';

export default function App() {
  const [firstName, setFirstName] = useState('');
  return (
    <>
      <h1>Make a Name Badge</h1>
      <NameBox
        firstName={firstName}
        onFirstNameChange={setFirstName}
      />
      <BadgePreview firstName={firstName} />
      <button onClick={() => setFirstName('')}>Start over</button>
    </>
  );
}
