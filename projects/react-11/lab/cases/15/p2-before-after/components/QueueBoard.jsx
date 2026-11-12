import { useState } from 'react';

export default function QueueBoard() {
  const [number, setNumber] = useState(12);
  const [announcement, setAnnouncement] = useState(
    'Welcome! Please take a number.'
  );

  function handleNext() {
    console.log(number);
    setNumber(number + 1);
    console.log(number);
  }

  return (
    <main>
      <h1>Bakery Queue</h1>
      <p className="now-serving">Now serving: {number}</p>
      <p className="announcement">{announcement}</p>
      <button className="next-btn" onClick={handleNext}>
        Next customer
      </button>
    </main>
  );
}
