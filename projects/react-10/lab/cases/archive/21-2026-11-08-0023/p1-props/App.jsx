import SubscribeBox from './components/SubscribeBox.jsx';

export default function App() {
  return (
    <main>
      <SubscribeBox status="error" />
      <hr />
      <SubscribeBox status="success" />
    </main>
  );
}
