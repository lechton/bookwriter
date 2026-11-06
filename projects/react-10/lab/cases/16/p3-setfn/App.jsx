import { useState } from 'react';

function someOtherFunction() {
  console.log('someOtherFunction was called by React');
  return 'value returned by someOtherFunction';
}

export default function App() {
  const [fn, setFn] = useState(null);
  const [returned, setReturned] = useState('not clicked');

  function storeWrong() {
    const result = setFn(someOtherFunction);
    setReturned(String(result));
  }

  function storeRight() {
    setFn(() => someOtherFunction);
  }

  return (
    <>
      <p>State holds: {typeof fn === 'function' ? 'a function named ' + fn.name : String(fn)}</p>
      <p>setFn returned: {returned}</p>
      <button className="wrong" onClick={storeWrong}>Wrong</button>
      <button className="right" onClick={storeRight}>Right</button>
    </>
  );
}
