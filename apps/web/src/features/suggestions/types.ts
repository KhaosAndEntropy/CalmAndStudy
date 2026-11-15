export type TopicSuggestionDraft = {
  title: string;
  field: string;
  reason: string;
  source: string;
  sources?: { publisher: string; url: string }[];
  kind: 'topic' | 'review';
  editorialPolicyAccepted?: boolean;
  articleId?: string;
  articleTitle?: string;
};

export type TopicSuggestion = TopicSuggestionDraft & {
  id: string;
  createdAt: string;
  status: 'pending';
};
