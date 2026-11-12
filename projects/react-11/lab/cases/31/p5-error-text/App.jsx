export default function App() {
  let text = '';
  try {
    document.body.removeChild(document.createElement('p'));
  } catch (e) {
    text = [e.name, String(e), e.stack.split('\n')[0]].join(' | ');
  }
  return <p>{text}</p>;
}
