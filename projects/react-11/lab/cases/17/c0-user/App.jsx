import { useState } from 'react';

function Way1() {
  const [user, setUser] = useState({ name: 'John' });

  function handleClick() {
    user.name = 'Alice';
    setUser(user);
  }

  return <p>Way 1: {user.name} <button className="way1" onClick={handleClick}>Change name</button></p>;
}

function Way2() {
  const [user, setUser] = useState({ name: 'John' });

  function handleClick() {
    setUser({ name: 'Alice' });
  }

  return <p>Way 2: {user.name} <button className="way2" onClick={handleClick}>Change name</button></p>;
}

function Number() {
  const [x, setX] = useState(0);

  function handleClick() {
    setX(5);
  }

  return <p>Number: {x} <button className="num" onClick={handleClick}>Set 5</button></p>;
}

export default function App() {
  return (
    <main>
      <Number />
      <Way1 />
      <Way2 />
    </main>
  );
}
