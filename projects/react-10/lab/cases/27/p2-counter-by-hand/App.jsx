function counterReducer(count, action) {
  if (action.type === 'incremented') {
    return count + 1;
  }
}

function ifReducer(count, action) {
  if (action.type === 'incremented') {
    return count + 1;
  }
  if (action.type === 'reset') {
    return 0;
  }
}

function switchReducer(count, action) {
  switch (action.type) {
    case 'incremented': {
      return count + 1;
    }
    case 'reset': {
      return 0;
    }
  }
}

console.log('counterReducer(0)', counterReducer(0, { type: 'incremented' }));
console.log('counterReducer(5)', counterReducer(5, { type: 'incremented' }));
console.log('reduce', [1, 2, 3, 4, 5].reduce((result, number) => result + number));
console.log('if vs switch', JSON.stringify([ifReducer(4, { type: 'incremented' }), switchReducer(4, { type: 'incremented' }), ifReducer(4, { type: 'reset' }), switchReducer(4, { type: 'reset' })]));

export default function App() {
  return <p>by hand</p>;
}
