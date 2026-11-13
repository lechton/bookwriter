export function getProduct() {
  return new Promise(resolve => {
    setTimeout(() => resolve({ name: 'Blue Sneakers', price: 49 }), 1000);
  });
}
