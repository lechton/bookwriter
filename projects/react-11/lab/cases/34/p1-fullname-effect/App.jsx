import { useState, useEffect } from 'react';

export default function App() {
  const [firstName, setFirstName] = useState('Taylor');
  const [lastName, setLastName] = useState('Swift');
  const [fullName, setFullName] = useState('');

  useEffect(() => {
    setFullName(firstName + ' ' + lastName); // Runs after React has already rendered the empty fullName
  }, [firstName, lastName]);

  return <p>Name: {fullName}</p>;
}
