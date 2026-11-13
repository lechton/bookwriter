import { useState } from 'react';
import StatusBar from './StatusBar.jsx';
import SaveButton from './SaveButton.jsx';

export default function App() {
  const [isSaved, setIsSaved] = useState(false);
  return (
    <>
      <StatusBar isSaved={isSaved} />
      <SaveButton onSave={() => setIsSaved(true)} />
    </>
  );
}
