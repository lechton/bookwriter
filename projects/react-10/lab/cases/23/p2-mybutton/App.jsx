function MyButton({ onSmash }) {
  return <button onClick={onSmash}>Click me</button>;
}

export default function App() {
  return <MyButton onSmash={() => console.log('Hello')} />;
}
