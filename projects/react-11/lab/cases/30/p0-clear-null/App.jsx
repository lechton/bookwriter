export default function App() {
  const results = [];
  for (const value of [null, undefined, 999999]) {
    try { clearInterval(value); results.push(String(value) + ': no error'); } catch (e) { results.push(String(value) + ': ' + e.message); }
  }
  return <p>{results.join(' | ')}</p>;
}
