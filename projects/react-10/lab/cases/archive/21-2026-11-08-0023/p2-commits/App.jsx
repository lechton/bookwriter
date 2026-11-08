import { Profiler } from 'react';
import SubscribeBox from './components/SubscribeBox.jsx';

export default function App() {
  return (
    <Profiler id="box" onRender={(id, phase) => console.log('commit ' + phase)}>
      <SubscribeBox />
    </Profiler>
  );
}
