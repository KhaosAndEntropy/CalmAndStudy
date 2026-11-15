import { Clock3, ShieldCheck } from 'lucide-react';
import type { Topic } from '@calmandstudy/content';
import { ContentLikeButton } from '../engagement/ContentLikeButton';
import type { EngagementItem } from '../engagement/types';
import { ReadStatusButton } from './ReadStatusButton';

type ReaderArticleMetaProps = {
  topic: Topic;
  read: boolean;
  onToggleRead: () => void;
  engagement: EngagementItem;
  engagementAvailable: boolean;
  onToggleLike: () => void;
};

/** Shows reading metadata and the reader's local engagement actions. */
export function ReaderArticleMeta({
  topic,
  read,
  onToggleRead,
  engagement,
  engagementAvailable,
  onToggleLike,
}: ReaderArticleMetaProps) {
  const assessment = topic.editorial?.status === 'published' ? topic.editorial.assessment : null;

  return (
    <>
      <div className="reader-stats">
        <span>
          <Clock3 size={15} />
          {topic.readingTime} min de leitura
        </span>
        <span>
          <ShieldCheck size={15} />
          {assessment ? `Índice editorial: ${assessment.score}%` : 'Verificação editorial pendente'}
        </span>
      </div>
      <div className="reader-engagement-actions">
        <ReadStatusButton read={read} onToggle={onToggleRead} />
        <ContentLikeButton
          item={engagement}
          disabled={!engagementAvailable}
          onClick={onToggleLike}
        />
      </div>
    </>
  );
}
