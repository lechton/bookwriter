import { useOnlineStatus } from './useOnlineStatus.js';
import { useSaveStatus } from './useSaveStatus.js';

export default function SaveButton() {
  const isOnline = useOnlineStatus();
  const [isSaved, setIsSaved] = useSaveStatus();
  function handleSaveClick() {
    console.log('Progress saved');
    setIsSaved(true);
  }

  return (
    <button disabled={!isOnline} onClick={handleSaveClick}>
      {isOnline ? 'Save progress' : 'Reconnecting...'}
    </button>
  );
}
