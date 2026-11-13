import { useOnlineStatus } from './useOnlineStatus.js';

export default function SaveButton() {
  const isOnline = useOnlineStatus();
  function handleSaveClick() {
    console.log('Progress saved');
  }

  return (
    <button disabled={!isOnline} onClick={handleSaveClick}>
      {isOnline ? 'Save progress' : 'Reconnecting...'}
    </button>
  );
}
