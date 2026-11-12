import { useRef } from 'react';

export default function App() {
  const firstCatRef = useRef(null);
  const lastCatRef = useRef(null);

  function handleScrollToFirstCat() {
    firstCatRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }

  function handleScrollToLastCatNoOptions() {
    lastCatRef.current.scrollIntoView();
  }

  return (
    <>
      <nav>
        <button onClick={handleScrollToFirstCat}>Neo</button>
        <button onClick={handleScrollToLastCatNoOptions}>Last</button>
      </nav>
      <div id="row" style={{ width: 300, overflowX: 'auto', whiteSpace: 'nowrap' }}>
        <img ref={firstCatRef} src="https://placecats.com/neo/300/200" alt="Neo" width="300" height="200" />
        <img src="https://placecats.com/millie/200/200" alt="Millie" width="300" height="200" />
        <img ref={lastCatRef} src="https://placecats.com/bella/199/200" alt="Bella" width="300" height="200" />
      </div>
    </>
  );
}
