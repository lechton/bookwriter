import cartReducer from './cartReducer.js';

const result = cartReducer([{ id: 2, name: 'Milk', quantity: 1 }], { type: 'decreased', id: 2 });
console.log(result);
console.log('initialCart untouched test', JSON.stringify(result));

export default function App() {
  return <p>test</p>;
}
