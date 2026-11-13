import { useActionState, useOptimistic } from 'react';
import { saveLike } from './api.js';

function applyLike(current, liked) {
  return { liked, likes: current.likes + (liked ? 1 : -1) };
}

async function updateLike(previousPost, nextLiked) {
  const saved = await saveLike(nextLiked);
  return saved ? applyLike(previousPost, nextLiked) : previousPost;
}

export default function LikeButton() {
  const [post, likeAction] = useActionState(updateLike, { liked: false, likes: 12 });
  const [optimisticPost, setOptimisticPost] = useOptimistic(post, applyLike);

  async function submitAction() {
    const nextLiked = !optimisticPost.liked;
    setOptimisticPost(nextLiked);
    return likeAction(nextLiked);
  }

  return (
    <form action={submitAction}>
      <button type="submit">{optimisticPost.liked ? '❤️ Liked' : '🤍 Like'}</button>
      <p>{post.likes} likes</p>
    </form>
  );
}
