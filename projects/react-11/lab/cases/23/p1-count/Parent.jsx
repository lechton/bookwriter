import { useState } from 'react';
import Child from './Child.jsx';

export default function Parent() {
  const [count, setCount] = useState(0);
  return (
    <div>
      <p>{count}</p>
      <Child />
    </div>
  );
}
