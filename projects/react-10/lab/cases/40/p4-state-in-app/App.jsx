import { useState } from 'react';
import SiteHeader from './components/SiteHeader.jsx';
import SignupForm from './components/SignupForm.jsx';

export default function App() {
  const [password, setPassword] = useState('');
  return (
    <main>
      <SiteHeader />
      <SignupForm password={password} onPasswordChange={setPassword} />
    </main>
  );
}
