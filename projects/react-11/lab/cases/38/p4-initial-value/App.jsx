import { useState } from 'react';

const adminPerms = 'read, write, delete';
const userPerms = 'read';

function Permissions({ userType }) {
  const [permissions, setPermissions] = useState(userType === 'admin' ? adminPerms : userPerms);
  return <p>{userType}: {permissions}</p>;
}

export default function App() {
  const [userType, setUserType] = useState('admin');
  return (
    <>
      <Permissions userType={userType} />
      <button onClick={() => setUserType(userType === 'admin' ? 'user' : 'admin')}>Switch user type</button>
    </>
  );
}
