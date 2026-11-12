export default function Parent() {
  return (
    <>
      <Counter count={3} />
      <Display count={3} />
    </>
  );
}

function Counter({ count }) {
  return <button>Clicked {count} times</button>;
}

function Display({ count }) {
  return <p>Count: {count}</p>;
}
