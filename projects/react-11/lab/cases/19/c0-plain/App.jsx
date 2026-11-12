const log = (label, value) => console.log(label + ' ' + JSON.stringify(value));

function principle1() {
  {
    const names = ['Cara', 'Anna', 'Ben'];
    names.push('Dan');
    log('P1 Way A Object.is(names, names)', Object.is(names, names));
  }
  {
    const names = ['Cara', 'Anna', 'Ben'];
    const nextNames = [...names, 'Dan'];
    log('P1 Way B Object.is(names, nextNames)', Object.is(names, nextNames));
  }
  {
    const names = ['Cara', 'Anna', 'Ben'];
    log('P1 atEnd', [...names, 'Dan']);
    log('P1 atStart', ['Dan', ...names]);
    const c = names.concat('Dan');
    log('P1 concat', c);
    log('P1 concat is new', c !== names);
  }
}

function principle2() {
  {
    const names = ['Cara', 'Anna', 'Ben'];
    const fewer = names.filter(name => name !== 'Anna');
    log('P2 Way A fewer', fewer);
    log('P2 Way A names', names);
  }
  {
    const names = ['Cara', 'Anna', 'Ben'];
    names.splice(1, 1);
    log('P2 Way B names', names);
  }
  log('P2 1 !== 2', 1 !== 2);
  log('P2 2 !== 2', 2 !== 2);
  {
    const names = ['Cara', 'Anna', 'Ben'];
    const all = names.filter(() => true);
    log('P2 filter keeping all is new array', all !== names);
    const a = ['Cara', 'Anna', 'Ben'];
    log('P2 pop returns', a.pop());
    log('P2 after pop', a);
    const b = ['Cara', 'Anna', 'Ben'];
    log('P2 shift returns', b.shift());
    log('P2 after shift', b);
    const s = ['Cara', 'Anna', 'Ben'];
    log('P2 splice returns', s.splice(1, 1));
  }
}

function principle3() {
  {
    const names = ['Cara', 'Anna', 'Ben'];
    const nextNames = [...names.slice(0, 1), 'Dan', ...names.slice(1)];
    log('P3 Way A nextNames', nextNames);
    log('P3 Way A names', names);
  }
  {
    const names = ['Cara', 'Anna', 'Ben'];
    names.splice(1, 0, 'Dan');
    log('P3 Way B names', names);
  }
  {
    const names = ['Cara', 'Anna', 'Ben'];
    const insertAt = 1;
    log('P3 before', names.slice(0, insertAt));
    log('P3 after', names.slice(insertAt));
    log('P3 slice(1, 0, x)', names.slice(1, 0, 'Dan'));
    log('P3 toSpliced', names.toSpliced(1, 0, 'Dan'));
    log('P3 names after toSpliced', names);
  }
}

function principle4() {
  {
    const names = ['Cara', 'Anna', 'Ben'];
    const sorted = names.sort();
    log('P4 Way A Object.is(names, sorted)', Object.is(names, sorted));
    log('P4 Way A names', names);
  }
  {
    const names = ['Cara', 'Anna', 'Ben'];
    const sorted = [...names].sort();
    log('P4 Way B names', names);
    log('P4 Way B sorted', sorted);
    log('P4 Way B Object.is(names, sorted)', Object.is(names, sorted));
  }
  {
    const names = ['Cara', 'Anna', 'Ben'];
    const r = names.reverse();
    log('P4 reverse returns same array', r === names);
    const nextSame = names;
    const nextCopy = [...names];
    log('P4 nextSame === names', nextSame === names);
    log('P4 nextCopy === names', nextCopy === names);
  }
  {
    const names = ['Cara', 'Anna', 'Ben'];
    log('P4 toSorted', names.toSorted());
    log('P4 toReversed', names.toReversed());
    log('P4 names after toSorted and toReversed', names);
  }
  {
    const queue = ['Sunny Road', 'Blue Bicycle', 'Night Train'];
    const index = 2;
    const next = [...queue];
    const above = next[index - 1];
    next[index - 1] = next[index];
    next[index] = above;
    log('P4 swap next', next);
    log('P4 swap queue', queue);
  }
}

function principle5() {
  {
    const people = [{ id: 1, name: 'Anna', seen: false }];
    const copy = [...people];
    log('P5 Way A copy[0] === people[0]', copy[0] === people[0]);
    copy[0].seen = true;
    log('P5 Way A people[0].seen', people[0].seen);
  }
  {
    const people = [{ id: 1, name: 'Anna', seen: false }];
    const next = people.map(p => p.id === 1 ? { ...p, seen: true } : p);
    log('P5 Way B next[0].seen', next[0].seen);
    log('P5 Way B people[0].seen', people[0].seen);
    log('P5 Way B next[0] === people[0]', next[0] === people[0]);
  }
}

function recipes({ queue, newSong, id }) {
  const addedEnd = [...queue, newSong];
  const removed = queue.filter(s => s.id !== id);
  const inserted = [...queue.slice(0, 1), newSong, ...queue.slice(1)];
  const next = [...queue];
  const updated = queue.map(s => s.id === id ? { ...s, liked: !s.liked } : s);
  const t = (arr) => arr.map(s => s.title + (s.liked ? ' liked' : ''));
  log('R addedEnd', t(addedEnd));
  log('R removed', t(removed));
  log('R inserted', t(inserted));
  log('R next is copy', next !== queue && next.every((s, i) => s === queue[i]));
  log('R updated', t(updated));
  log('R updated keeps others', updated[0] === queue[0] && updated[1] !== queue[1]);
}

principle1();
principle2();
principle3();
principle4();
principle5();
recipes({
  queue: [
    { id: 1, title: 'Sunny Road', liked: false },
    { id: 2, title: 'Blue Bicycle', liked: false },
    { id: 3, title: 'Night Train', liked: false },
  ],
  newSong: { id: 4, title: 'Rainy Window', liked: false },
  id: 2,
});

export default function App() {
  return <p>Plain JavaScript checks are in the Console.</p>;
}
