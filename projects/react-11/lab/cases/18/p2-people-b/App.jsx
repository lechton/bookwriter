const people = [
  { id: 1, name: 'Anna' },
  { id: 2, name: 'Ben' },
  { id: 3, name: 'Cara' }
];

function Person({ name }) {
  return <li>{name}</li>;
}

function PeopleList() {
  return (
    <ul>
      {people.map(person => (
        <Person key={person.id} name={person.name} />
      ))}
    </ul>
  );
}

export default function App() {
  return <PeopleList />;
}
