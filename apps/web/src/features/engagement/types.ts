export type EngagementContentType = 'article' | 'trail' | 'tutorial';

export type EngagementItem = {
  type: EngagementContentType;
  id: string;
  reads: number;
  likes: number;
  liked: boolean;
};

export type EngagementAction = 'read' | 'like';
