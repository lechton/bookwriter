import { useState } from 'react';

export default function CopyButton() {
  const [status, setStatus] = useState('ready');

  function handleClick() {
    setStatus('copied');
    setTimeout(() => setStatus('ready'), 1500);
  }

  return <button onClick={handleClick}>{status === 'copied' ? 'Copied!' : 'Copy link'}</button>;
}
