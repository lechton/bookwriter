import { useOnlineStatus } from './useOnlineStatus.js';
import { useSaveStatus } from './useSaveStatus.js';

export default function StatusBar() {
  const isOnline = useOnlineStatus();
  const [isSaved] = useSaveStatus();
  return (
    <>
      <h1>{isOnline ? 'Online' : 'Disconnected'}</h1>
      {isSaved && <p>All changes saved</p>}
    </>
  );
}
