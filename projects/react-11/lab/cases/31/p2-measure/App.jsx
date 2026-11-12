import { useRef, useState } from 'react';

export default function App() {
  const boxRef = useRef(null);
  const hiddenRef = useRef(null);
  const [width, setWidth] = useState(0);
  const [hidden, setHidden] = useState(null);

  function handleMeasure() {
    setWidth(boxRef.current.offsetWidth);
    setHidden(hiddenRef.current.offsetWidth);
    const rect = boxRef.current.getBoundingClientRect();
    console.log('rect', JSON.stringify(rect));
  }

  return (
    <>
      <div ref={boxRef} style={{ width: 200, padding: 10, border: '5px solid black' }}>Chart area</div>
      <div ref={hiddenRef} style={{ display: 'none' }}>Hidden</div>
      <button onClick={handleMeasure}>Measure</button>
      <p>Width: {width}</p>
      <p>Hidden width: {String(hidden)}</p>
    </>
  );
}
