import type { Topic } from '@calmandstudy/content';
import { TopicArtwork } from './TopicArtwork';
import { ContentLikeButton } from '../engagement/ContentLikeButton';
import type { EngagementItem } from '../engagement/types';
import { ReadStatusButton } from '../reader/ReadStatusButton';
import { areaToneStyle } from '../shared/areaTone';

export function LibraryTopicCard({
  topic,
  onOpen,
  engagementAvailable,
  engagement,
  onToggleLike,
  read,
  onToggleRead,
}: {
  topic: Topic;
  onOpen: () => void;
  engagementAvailable: boolean;
  engagement: EngagementItem;
  onToggleLike: () => void;
  read: boolean;
  onToggleRead: () => void;
}) {
  return (
    <article className="library-card" style={areaToneStyle(topic.field)}>
      <TopicArtwork topic={topic} mode="card" />
      <div className="topic-meta">
        {topic.field}
        <span aria-hidden="true">·</span>
        {topic.readingTime} min
      </div>
      <h3>
        <button className="library-title-button" onClick={onOpen}>
          {topic.title}
        </button>
      </h3>
      <p>{topic.summary}</p>
      <div className="library-card-actions">
        <ReadStatusButton read={read} compact onToggle={onToggleRead} />
        <ContentLikeButton
          item={engagement}
          disabled={!engagementAvailable}
          onClick={onToggleLike}
        />
      </div>
    </article>
  );
}
