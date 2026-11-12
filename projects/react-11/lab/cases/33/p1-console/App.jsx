fetch('/api/bio/Alice')
  .then(response => response.json())
  .then(data => console.log(data.bio));

export default function App() {
  return <p>Open the Console</p>;
}
