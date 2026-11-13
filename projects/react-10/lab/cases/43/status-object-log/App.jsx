import { useFormStatus } from 'react-dom';

function Report({ where }) {
  const status = useFormStatus();
  console.log(where + ': ' + JSON.stringify({ pending: status.pending, data: status.data, method: status.method, action: status.action === null ? null : typeof status.action }));
  return null;
}

function Form() {
  const { pending } = useFormStatus();
  console.log('Form renders the form tag: pending=' + pending);
  return (
    <form action={async () => { await new Promise(r => setTimeout(r, 1000)); }}>
      <Report where="inside the form" />
      <button type="submit">Send</button>
    </form>
  );
}

export default function App() {
  return (
    <>
      <Report where="no form above" />
      <Form />
    </>
  );
}
