import { useState } from 'react';

export default function QueueBoard() {
  const [number, setNumber] = useState(12);
  const [announcement, setAnnouncement] = useState(
    'Welcome! Please take a number.'
  );

  function handleNext() {
    const nextNumber = number + 1;
    setNumber(nextNumber);
    setAnnouncement('Number ' + nextNumber + ', please come to the counter');
    console.log(number, nextNumber);
    setTimeout(() => {
      setAnnouncement('Last call for number ' + nextNumber);
      console.log('timer reads ' + nextNumber);
    }, 3000);
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
