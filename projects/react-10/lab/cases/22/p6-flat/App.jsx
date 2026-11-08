import { useState } from 'react';

const initialTravelPlan = {
  0: { id: 0, title: 'Earth', childIds: [1] },
  1: { id: 1, title: 'Africa', childIds: [2] },
  2: { id: 2, title: 'Kenya', childIds: [] },
};

const nestedPlan = {
  id: 0,
  title: 'Earth',
  childPlaces: [
    {
      id: 1,
      title: 'Africa',
      childPlaces: [{ id: 2, title: 'Kenya', childPlaces: [] }],
    },
  ],
};

function flatOrder(plan, id, depth, out) {
  out.push('-'.repeat(depth) + plan[id].title);
  plan[id].childIds.forEach(childId => flatOrder(plan, childId, depth + 1, out));
  return out;
}

function nestedOrder(place, depth, out) {
  out.push('-'.repeat(depth) + place.title);
  place.childPlaces.forEach(child => nestedOrder(child, depth + 1, out));
  return out;
}

export default function App() {
  const [plan, setPlan] = useState(initialTravelPlan);

  function handleRemoveKenya() {
    const parentId = 1;
    const parent = plan[parentId];
    const nextParent = { ...parent, childIds: parent.childIds.filter(id => id !== 2) };
    setPlan({ ...plan, [parentId]: nextParent });
  }

  return (
    <main>
      <p>nested: {nestedOrder(nestedPlan, 0, []).join(' ')}</p>
      <p>flat: {flatOrder(plan, 0, 0, []).join(' ')}</p>
      <p>keys in table: {Object.keys(plan).join(',')}; Kenya entry still there: {String(plan[2] !== undefined)}; Earth same object: {String(plan[0] === initialTravelPlan[0])}</p>
      <button onClick={handleRemoveKenya}>Remove Kenya</button>
    </main>
  );
}
