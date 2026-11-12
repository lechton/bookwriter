import { useEffect, useState } from 'react';

function Loading() {
  return <p>Loading...</p>;
}

function Report({ data }) {
  if (!data) {
    return <Loading />;
  }
  const [processed, setProcessed] = useState(data);
  return <p>{processed}</p>;
}

export default function App() {
  const [data, setData] = useState(null);
  useEffect(() => {
    const id = setTimeout(() => setData('3 new messages'), 500);
    return () => clearTimeout(id);
  }, []);
  return <Report data={data} />;
}
