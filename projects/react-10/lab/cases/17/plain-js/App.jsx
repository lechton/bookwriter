const out = [];
const log = (...a) => out.push(a.map((v) => (typeof v === 'string' ? v : JSON.stringify(v))).join(' '));

{
  const user = { name: 'John' };
  user.name = 'Alice';
  log('P1 Object.is(user, user):', Object.is(user, user));
  const nextUser = { name: 'Alice' };
  log('P1 Object.is(user, nextUser):', Object.is(user, nextUser));
}
{
  const user = { name: 'John', age: 30, city: 'Rome' };
  const nextByHand = { name: user.name, age: user.age, city: 'Paris' };
  const nextBySpread = { ...user, city: 'Paris' };
  log('P2 nextByHand:', nextByHand, 'nextBySpread:', nextBySpread);
  log('P2 Object.is(user, { ...user }):', Object.is(user, { ...user }));
  const order1 = { ...user, city: 'Paris' };
  const order2 = { city: 'Paris', ...user };
  log('P2 order1.city:', order1.city, 'order2.city:', order2.city);
  const noParens = (o) => { quantity: o.quantity + 1 };
  const parens = (o) => ({ ...o, quantity: o.quantity + 1 });
  log('P2 arrow without parens returns:', String(noParens({ quantity: 1 })), 'with parens:', parens({ quantity: 1 }));
}
{
  const user = { name: 'John', address: { city: 'Rome' } };
  const copy = { ...user };
  log('P3 Object.is(copy, user):', Object.is(copy, user));
  log('P3 Object.is(copy.address, user.address):', Object.is(copy.address, user.address));
  copy.address.city = 'Paris';
  log('P3 after copy.address.city = Paris, user.address.city:', user.address.city);
}
{
  const user = { name: 'John', address: { city: 'Rome' } };
  const nextAddress = { ...user.address, city: 'Paris' };
  const nextUser1 = { ...user, address: nextAddress };
  const nextUser2 = { ...user, address: { ...user.address, city: 'Paris' } };
  log('P3 nextUser1:', nextUser1, 'nextUser2:', nextUser2, 'user.address.city:', user.address.city);
}
{
  const key = 'city';
  const obj1 = { city: 'Paris' };
  const obj2 = { [key]: 'Paris' };
  const obj3 = { key: 'Paris' };
  log('P4 obj1:', obj1, 'obj2:', obj2, 'obj3:', obj3);
}
{
  const order = { item: 'Coffee mug', quantity: 1, giftWrap: false };
  const byHand = { item: order.item, quantity: order.quantity + 1, giftWrap: order.giftWrap };
  const spread = { ...order, quantity: order.quantity + 1 };
  log('Ways byHand:', byHand, 'spread:', spread);
}

function Card(props) {
  return <p>JSX spread title: {props.title}</p>;
}

export default function App() {
  const article = { title: 'Old title' };
  return (
    <main>
      {out.map((line) => <p key={line}>{line}</p>)}
      <Card {...article} title="New title" />
    </main>
  );
}
