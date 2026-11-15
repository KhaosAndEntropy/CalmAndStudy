import { Check, Circle } from 'lucide-react';

export function ReadStatusButton({
  read,
  compact = false,
  onToggle,
}: {
  read: boolean;
  compact?: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      className={`read-status-button ${read ? 'is-read' : ''} ${compact ? 'is-compact' : ''}`}
      type="button"
      aria-pressed={read}
      aria-label={read ? 'Marcar artigo como não lido' : 'Marcar artigo como lido'}
      onClick={onToggle}
    >
      {read ? <Check size={15} aria-hidden="true" /> : <Circle size={15} aria-hidden="true" />}
      {read ? (compact ? 'Lido' : 'Lido por você') : compact ? 'Marcar lido' : 'Marcar como lido'}
    </button>
  );
}
