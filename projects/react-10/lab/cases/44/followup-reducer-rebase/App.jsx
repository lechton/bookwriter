import { startTransition, useEffect, useOptimistic, useState } from 'react';

function applyLike(current, liked) {
  return { liked, likes: current.likes + (liked ? 1 : -1) };
}

export default function App() {
  const [post, setPost] = useState({ liked: false, likes: 12 });
  const [withReducer, setWithReducer] = useOptimistic(post, applyLike);
  const [withValue, setWithValue] = useOptimistic(post);

  function handleClick() {
    startTransition(async () => {
      setWithReducer(true);
      setWithValue({ liked: true, likes: post.likes + 1 });
      await new Promise(resolve => setTimeout(resolve, 1000));
    });
    setTimeout(() => setPost(p => ({ ...p, likes: p.likes + 5 })), 300);
  }

  return (
    <form>
      <button type="button" onClick={handleClick}>Like</button>
      <p>reducer: {withReducer.likes}, value: {withValue.likes}, base: {post.likes}</p>
    </form>
  );
}
