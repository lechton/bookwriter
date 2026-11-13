import { useOnlineStatus } from './useOnlineStatus.js';

export default function StatusBar({ isSaved }) {
  const isOnline = useOnlineStatus();
  return (
    <>
      <h1>{isOnline ? 'Online' : 'Disconnected'}</h1>
      {isSaved && <p>All changes saved</p>}
    </>
  );
}
