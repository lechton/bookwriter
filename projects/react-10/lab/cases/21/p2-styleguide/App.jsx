import PromoCode from './components/PromoCode.jsx';

const statuses = ['empty', 'typing', 'checking', 'error', 'success'];

export default function App() {
  return (
    <>
      {statuses.map(status => (
        <section key={status}>
          <h4>{status}</h4>
          <PromoCode status={status} />
        </section>
      ))}
    </>
  );
}
