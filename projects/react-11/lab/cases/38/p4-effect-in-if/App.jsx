import { useEffect, useState } from 'react';

function fetchUserData() {
  console.log('Fetching the user data');
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  if (isLoggedIn) {
    useEffect(() => {
      fetchUserData();
    }, []);
  }

  return (
    <>
      <p>{isLoggedIn ? 'Signed in' : 'Signed out'}</p>
      <button onClick={() => setIsLoggedIn(true)}>Sign in</button>
    </>
  );
}
