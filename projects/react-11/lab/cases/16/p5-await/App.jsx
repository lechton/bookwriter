import { useState } from 'react';

const wait = (ms) => new Promise((done) => setTimeout(done, ms));

export default function App() {
  const [plain, setPlain] = useState(0);
  const [updater, setUpdater] = useState(0);

  async function addPlain() {
    await wait(200);
    setPlain(plain + 1);
  }

  async function addUpdater() {
    await wait(200);
    setUpdater(u => u + 1);
  }

  return (
    <>
      <button className="plain" onClick={addPlain}>Plain: {plain}</button>
      <button className="updater" onClick={addUpdater}>Updater: {updater}</button>
    </>
  );
}
