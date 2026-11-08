export default function App() {
  return (
    <dl>
      {['Anna', 'Ben'].map(name => (
        <key={name}>
          <dt>{name}</dt>
          <dd>Friend</dd>
        </>
      ))}
    </dl>
  );
}
