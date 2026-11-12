import { Fragment } from 'react';

const people = [
  { id: 1, name: 'Anna', bio: 'Builds the mail server.' },
  { id: 2, name: 'Ben', bio: 'Designs the inbox page.' }
];

function BioList({ people }) {
  return (
    <article>
      {people.map(person => (
        <Fragment key={person.id}>
          <h2>{person.name}</h2>
          <p>{person.bio}</p>
        </Fragment>
      ))}
    </article>
  );
}

export default function App() {
  return <BioList people={people} />;
}
