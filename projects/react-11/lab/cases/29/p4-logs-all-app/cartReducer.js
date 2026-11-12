export default function cartReducer(cart, action) {
  switch (action.type) {
    case 'increased': {
      return cart.map(item => item.id === action.id ? { ...item, quantity: item.quantity + 1 } : item);
    }
    case 'decreased': {
      return cart.map(item => item.id === action.id ? { ...item, quantity: item.quantity - 1 } : item).filter(item => item.quantity > 0);
    }
    case 'deleted': {
      return cart.filter(item => item.id !== action.id);
    }
    case 'emptied': {
      return [];
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
