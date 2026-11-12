const names = ['Anna', 'Ben', 'Cara'];
const numbers = [1, 2, 3];

const doubledShort = numbers.map(n => n * 2);
const doubledBlock = numbers.map(n => { return n * 2; });
const doubledMissing = numbers.map(n => { n * 2; });
console.log('doubledShort', JSON.stringify(doubledShort));
console.log('doubledBlock', JSON.stringify(doubledBlock));
console.log('block without return', JSON.stringify(doubledMissing));
console.log('names after map', JSON.stringify(names));

export default function App() {
  return (
    <main>
      <ul className="by-hand">
        <li>Anna</li>
        <li>Ben</li>
        <li>Cara</li>
      </ul>
      <ul className="by-map">
        {names.map(name => <li>{name}</li>)}
      </ul>
    </main>
  );
}
