import { useState } from 'react';

const initialTravelPlan = {
  0: { id: 0, title: 'Earth', childIds: [1] },
  1: { id: 1, title: 'Africa', childIds: [2] },
  2: { id: 2, title: 'Kenya', childIds: [] },
};

function Place({ id, plan }) {
  const place = plan[id];
  return (
    <li>
      {place.title}
      {place.childIds.length > 0 && (
        <ol>
          {place.childIds.map(childId => <Place key={childId} id={childId} plan={plan} />)}
        </ol>
      )}
    </li>
  );
}

export default function App() {
  const [plan, setPlan] = useState(initialTravelPlan);

  function handleCheckOffKenya() {
    const parentId = 1;
    const parent = plan[parentId];
    const nextParent = {
      ...parent,
      childIds: parent.childIds.filter(id => id !== 2),
    };
    const nextPlan = { ...plan, [parentId]: nextParent };
    window.__compare = {
      sameEarth: nextPlan[0] === plan[0],
      sameAfrica: nextPlan[1] === plan[1],
      sameTable: nextPlan === plan,
      nextPlan,
    };
    setPlan(nextPlan);
  }

  return (
    <main>
      <ol><Place id={0} plan={plan} /></ol>
      <button onClick={handleCheckOffKenya}>Check off Kenya</button>
    </main>
  );
}
