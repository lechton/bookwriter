const people = [
  { id: 1, name: 'Anna' },
  { id: 2, name: 'Ben' },
  { id: 3, name: 'Cara' }
];

function Person({ id, name }) {
  return <li key={id}>{name}</li>;
}

function PeopleList() {
  return (
    <ul>
      {people.map(person => (
        <Person id={person.id} name={person.name} />
      ))}
    </ul>
  );
}

export default function App() {
  return <PeopleList />;
}
