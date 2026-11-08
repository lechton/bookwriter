import { useState } from 'react';

function Panel({ title, children }) {
  const [isActive, setIsActive] = useState(false);
  return (
    <section>
      <h3>{title}</h3>
      {isActive ? <p>{children}</p> : <button onClick={() => setIsActive(true)}>Show</button>}
    </section>
  );
}

export default function App() {
  return (
    <>
      <Panel title="About">About text</Panel>
      <Panel title="Etymology">Etymology text</Panel>
    </>
  );
}
