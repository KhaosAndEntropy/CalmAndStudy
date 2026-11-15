export type LearningMode = 'calm' | 'adventure';

export const learningModeStorageKey = 'calmandstudy-learning-mode-v1';

export function isLearningMode(value: unknown): value is LearningMode {
  return value === 'calm' || value === 'adventure';
}
