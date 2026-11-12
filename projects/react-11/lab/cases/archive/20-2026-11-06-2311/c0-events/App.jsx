import { useEffect, useRef } from 'react';

export default function App() {
  const ref = useRef(null);
  useEffect(() => {
    const box = ref.current;
    const onInput = () => console.log('browser input');
    const onChange = () => console.log('browser change');
    box.addEventListener('input', onInput);
    box.addEventListener('change', onChange);
    return () => {
      box.removeEventListener('input', onInput);
      box.removeEventListener('change', onChange);
    };
  }, []);
  return (
    <>
      <input ref={ref} onChange={e => console.log('React onChange', e.target.value)} />
      <button>Other</button>
    </>
  );
}
