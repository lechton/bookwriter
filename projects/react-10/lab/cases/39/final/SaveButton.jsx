import { useOnlineStatus } from './useOnlineStatus.js';

export default function SaveButton({ onSave }) {
  const isOnline = useOnlineStatus();
  return (
    <button disabled={!isOnline} onClick={onSave}>
      {isOnline ? 'Save progress' : 'Reconnecting...'}
    </button>
  );
}
