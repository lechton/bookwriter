function Light({ status = 'off' }) {
  return status === 'on' ? <p>On</p> : <p>Off</p>;
}

export default function App() {
  return (
    <>
      <Light />
      <Light status="on" />
    </>
  );
}
