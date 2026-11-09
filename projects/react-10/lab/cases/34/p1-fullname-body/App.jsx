import { useState } from 'react';

export default function App() {
  const [firstName, setFirstName] = useState('Taylor');
  const [lastName, setLastName] = useState('Swift');
  const fullName = firstName + ' ' + lastName; // Taylor Swift, calculated on every render

  return <p>Name: {fullName}</p>;
}
