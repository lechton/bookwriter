import { useEffect, useRef } from 'react';

let lastOnMessage;

export default function MessageList({ onMessage }) {
  const renders = useRef(0);
  renders.current += 1;
  console.log('MessageList render, same onMessage as last render: ' + (onMessage === lastOnMessage));
  lastOnMessage = onMessage;

  useEffect(() => {
    console.log('MessageList Effect runs, calls onMessage');
    onMessage('from child');
  }, [onMessage]);

  return <p>Messages</p>;
}
