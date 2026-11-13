import { useState } from 'react';

export function useSaveStatus() {
  const [isSaved, setIsSaved] = useState(false);
  return [isSaved, setIsSaved];
}
