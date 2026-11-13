import { useFormStatus } from 'react-dom';

function Report() {
  const { pending, method } = useFormStatus();
  console.log('inside the form: pending=' + pending + ' method=' + method);
  return null;
}

export default function App() {
  return (
    <form method="post" action={async () => { await new Promise(r => setTimeout(r, 1000)); }}>
      <Report />
      <button type="submit">Send</button>
    </form>
  );
}
