function Signup({ status = 'typing' }) {
  if (status === 'success') {
    return <p>Welcome to the list!</p>;
  }
  return <button>Join</button>;
}

export default function App() {
  return (
    <>
      <Signup />
      <Signup status="success" />
    </>
  );
}
