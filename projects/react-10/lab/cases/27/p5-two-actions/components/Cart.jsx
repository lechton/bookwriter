import { useReducer } from 'react';

const initialCart = [
  { id: 0, name: 'Apple', quantity: 1 },
  { id: 1, name: 'Bread', quantity: 2 },
  { id: 2, name: 'Milk', quantity: 1 },
];

export default function Cart() {
  const [cart, dispatch] = useReducer(cartReducer, initialCart);

  function handleIncrease(id) {
    dispatch({ type: 'increased', id: id });
  }

  function handleDecrease(id) {
    dispatch({ type: 'decreased', id: id }); dispatch({ type: 'deleted', id: id });
  }

  function handleDelete(id) {
    dispatch({ type: 'deleted', id: id });
  }

  function handleEmpty() {
    dispatch({ type: 'emptied' });
  }

  return (
    <section>
      <h1>Your cart</h1>
      {cart.length === 0 && <p>Your cart is empty.</p>}
      <ul>
        {cart.map(item => (
          <li key={item.id}>
            {item.name}: {item.quantity}
            <button onClick={() => handleIncrease(item.id)}>Add one</button>
            <button onClick={() => handleDecrease(item.id)}>Remove one</button>
            <button onClick={() => handleDelete(item.id)}>Delete</button>
          </li>
        ))}
      </ul>
      <button onClick={handleEmpty}>Empty cart</button>
    </section>
  );
}

function cartReducer(cart, action) {
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
