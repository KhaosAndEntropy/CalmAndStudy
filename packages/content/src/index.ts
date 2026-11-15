export {
  calculateConfidenceScore,
  confidenceMethod,
  editorialPublishingPolicy,
  editorialCadence,
  validateEditorialRecord,
} from './editorial';
export type {
  EditorialRecord,
  ResearchClaim,
  ResearchSource,
  ConfidenceAssessment,
  ConfidenceDimensions,
  EvidenceReference,
  PublicationStatus,
  ClaimKind,
  EvidenceRelation,
  SourceKind,
} from './editorial';
export type { Topic, StudyPath, Tutorial, AssessmentQuestion, KnowledgeAssessment } from './types';
export {
  buildTopicAssessment,
  buildStudyPathAssessment,
  buildTutorialAssessment,
} from './assessments';
export { fields } from './fields';
export { studyPaths } from './study-paths';
export { suggestedNextTopicIds } from './recommendations';
export { tutorials } from './tutorials';

import { spaceTopics } from './topics/space';
import { lifesciencesTopics } from './topics/life-sciences';
import { earthsciencesTopics } from './topics/earth-sciences';
import { humanitiesTopics } from './topics/humanities';
import { formalsciencesTopics } from './topics/formal-sciences';
import { coverageTopics } from './topics/coverage';
import { suggestedNextTopicIds } from './recommendations';

/** Editorial catalog used by the web application. */
const catalogue = [
  ...spaceTopics,
  ...lifesciencesTopics,
  ...earthsciencesTopics,
  ...humanitiesTopics,
  ...formalsciencesTopics,
  ...coverageTopics,
];

const topicsById = new Map(catalogue.map(topic => [topic.id, topic]));
export const topics = catalogue.map(topic => {
  if (topic.recommendedBefore?.length) return topic;
  const previousId = Object.entries(suggestedNextTopicIds).find(([, nextIds]) =>
    nextIds.includes(topic.id),
  )?.[0];
  const previous = previousId ? topicsById.get(previousId) : undefined;
  return previous
    ? {
        ...topic,
        recommendedBefore: [
          {
            topicId: previous.id,
            title: previous.title,
            why: 'Essa leitura apresenta o contexto que ajuda a acompanhar este próximo passo. A sugestão é opcional.',
          },
        ],
      }
    : topic;
});
