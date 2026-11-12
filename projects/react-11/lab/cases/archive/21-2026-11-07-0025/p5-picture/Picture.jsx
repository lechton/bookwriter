import { useState } from 'react';

export default function Picture() {
  const [isActive, setIsActive] = useState(false);

  let className = 'picture';
  if (isActive) {
    className += ' picture--active';
  }

  return <img className={className} onClick={() => setIsActive(true)} src="/park.jpg" alt="The new park" />;
}
