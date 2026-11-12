import { useState } from 'react';

function ArticleCard(props) {
  return <p>Card: {props.title}</p>;
}

function Score() {
  const [score, setScore] = useState(2);
  console.log('Score renders with', score);
  return <p>Score: {score} <button className="same" onClick={() => setScore(2)}>Set 2</button> <button className="five" onClick={() => setScore(5)}>Set 5</button></p>;
}

function Shorthands() {
  const [item, setItem] = useState({ quantity: 1, giftWrap: false });
  function handlePlusPlus() {
    item.quantity++;
    setItem(item);
  }
  function handlePlusEquals() {
    item.quantity += 1;
    setItem(item);
  }
  return <p>Quantity: {item.quantity} <button className="pp" onClick={handlePlusPlus}>++</button> <button className="pe" onClick={handlePlusEquals}>+=</button></p>;
}

const article = { title: 'Old title' };

export default function App() {
  return (
    <>
      <Score />
      <Shorthands />
      <ArticleCard {...article} />
    </>
  );
}
