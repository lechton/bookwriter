const addOneFull = function (s) { return s + 1; };
const addOneShort = s => s + 1;

function getFinalState(baseState, queue) {
  let finalState = baseState;

  for (const update of queue) {
    if (typeof update === 'function') {
      finalState = update(finalState);
    } else {
      finalState = update;
    }
  }

  return finalState;
}

console.log('addOneFull(4): ' + addOneFull(4) + ', addOneShort(4): ' + addOneShort(4));
console.log('Order 1 queue: ' + getFinalState(0, [5, n => n + 1]));
console.log('Order 2 queue: ' + getFinalState(0, [n => n + 1, 5]));
console.log('42 at end queue: ' + getFinalState(0, [5, n => n + 1, 42]));
console.log('three updaters queue: ' + getFinalState(0, [n => n + 1, n => n + 1, n => n + 1]));
console.log('value 5 vs n => 5 after 1: ' + getFinalState(1, [5]) + ' / ' + getFinalState(1, [n => 5]));

export default function App() {
  return <p>plain JavaScript checks are in the Console</p>;
}
