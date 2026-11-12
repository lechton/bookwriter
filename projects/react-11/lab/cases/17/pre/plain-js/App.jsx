const item = { quantity: 1, giftWrap: false, delivery: { address: '12 Main Street', time: 'Morning' } };

console.log('Object.is(2, 2):', Object.is(2, 2));
item.quantity = 2;
console.log('after item.quantity = 2, Object.is(item, item):', Object.is(item, item));
console.log('Object.is(item, { ...item }):', Object.is(item, { ...item }));

const byHand = { quantity: item.quantity, giftWrap: true, delivery: item.delivery };
const bySpread = { ...item, giftWrap: true };
console.log('by hand:', JSON.stringify(byHand), 'by spread:', JSON.stringify(bySpread));
console.log('{ ...item, giftWrap: true }.giftWrap:', { ...item, giftWrap: true }.giftWrap);
console.log('{ giftWrap: true, ...item }.giftWrap:', { giftWrap: true, ...item }.giftWrap);
console.log('replace, not merge: { giftWrap: true }.quantity:', { giftWrap: true }.quantity);

const nextItem = { ...item };
nextItem.quantity = 5;
console.log('local mutation: nextItem.quantity', nextItem.quantity, 'item.quantity', item.quantity);
console.log('Object.is(nextItem.delivery, item.delivery):', Object.is(nextItem.delivery, item.delivery));
nextItem.delivery.time = 'Evening';
console.log('after nextItem.delivery.time = Evening, item.delivery.time:', item.delivery.time);

const two = { ...item, delivery: { ...item.delivery, time: 'Night' } };
console.log('two-level copy: two.delivery.time', two.delivery.time, 'item.delivery.time', item.delivery.time, 'address kept:', two.delivery.address);

const field = 'message';
console.log('{ [field]: Hi }:', JSON.stringify({ [field]: 'Hi' }));
console.log('{ field: Hi }:', JSON.stringify({ field: 'Hi' }));

export default function App() {
  return <p>plain JavaScript checks in the Console</p>;
}
