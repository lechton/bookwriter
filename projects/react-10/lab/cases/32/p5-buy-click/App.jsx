export default function App() {
  function handleClick() {
    fetch('/api/buy', { method: 'POST' });
  }

  return <button onClick={handleClick}>Buy</button>;
}
