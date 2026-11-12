import SubscribeBox from './components/SubscribeBox.jsx';

const statuses = ['typing', 'sending', 'success', 'error'];

export default function App() {
  return (
    <main>
      {statuses.map(status => (
        <div key={status}>
          <h3>Screen: {status}</h3>
          <SubscribeBox status={status} />
        </div>
      ))}
    </main>
  );
}
