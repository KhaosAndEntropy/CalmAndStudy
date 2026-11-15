import { Heart } from 'lucide-react';
import type { EngagementItem } from './types';

export function ContentLikeButton({
  item,
  disabled,
  onClick,
}: {
  item: EngagementItem;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      className={`content-like ${item.liked ? 'is-liked' : ''}`}
      type="button"
      aria-pressed={item.liked}
      aria-label={`${item.liked ? 'Remover curtida' : 'Curtir'}; ${item.likes} curtidas`}
      title={
        disabled ? 'Curtidas disponíveis quando as estatísticas estiverem configuradas' : undefined
      }
      disabled={disabled}
      onClick={onClick}
    >
      <Heart size={16} aria-hidden="true" fill={item.liked ? 'currentColor' : 'none'} />
      <span>{item.likes.toLocaleString('pt-BR')}</span>
    </button>
  );
}
