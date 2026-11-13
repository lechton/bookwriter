import { useState } from 'react';
import { saveLike } from './api.js';

export default function LikeButton() {
  const [liked, setLiked] = useState(false);

  async function handleLike() {
    setLiked(true);
    const saved = await saveLike(true);
    if (!saved) setLiked(false);
  }

  return (
    <form>
      <button type="button" onClick={handleLike}>{liked ? '❤️ Liked' : '🤍 Like'}</button>
    </form>
  );
}
