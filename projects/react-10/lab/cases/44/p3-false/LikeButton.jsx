import { useActionState, useOptimistic } from 'react';
import { saveLike } from './api.js';

async function updateLike(wasLiked, nextLiked) {
  await saveLike(nextLiked);
  return nextLiked;
}

export default function LikeButton() {
  const [liked, likeAction] = useActionState(updateLike, false);
  const [optimisticLiked, setOptimisticLiked] = useOptimistic(false);

  async function submitAction() {
    const nextLiked = !optimisticLiked;
    setOptimisticLiked(nextLiked);
    return likeAction(nextLiked);
  }

  return (
    <form action={submitAction}>
      <button type="submit">{optimisticLiked ? '❤️ Liked' : '🤍 Like'}</button>
    </form>
  );
}
