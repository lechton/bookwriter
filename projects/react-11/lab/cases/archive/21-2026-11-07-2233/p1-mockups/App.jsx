import CapitalQuiz from './components/CapitalQuiz.jsx';

const statuses = ['empty', 'typing', 'checking', 'wrong', 'right'];

export default function App() {
  return (
    <>
      {statuses.map(status => (
        <section key={status}>
          <h4>CapitalQuiz ({status}):</h4>
          <CapitalQuiz status={status} />
        </section>
      ))}
    </>
  );
}
