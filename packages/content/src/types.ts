import type { EditorialRecord } from './editorial';

export type Topic = {
  id: string;
  title: string;
  field: string;
  period: string;
  readingTime: number;
  confidence: number;
  confidenceLabel: string;
  summary: string;
  fact: string;
  detail: string;
  sourceCount: number;
  sources: { name: string; url: string; kind: string }[];
  tags: string[];
  editorial?: EditorialRecord;
  image?: { url: string; alt: string; credit: string; creditUrl: string; license?: string };
  recommendedBefore?: { topicId?: string; title: string; why: string }[];
  relatedTopics?: string[];
};

export type StudyPath = {
  id: string;
  title: string;
  field: string;
  description: string;
  topicIds: string[];
  connectionNote: string;
};

export type Tutorial = {
  id: string;
  title: string;
  field: string;
  durationMinutes: number;
  description: string;
  materials: string[];
  steps: { title: string; instruction: string }[];
  wrapUp: string;
  sources?: { name: string; url: string }[];
};

export type AssessmentQuestion = {
  id: string;
  prompt: string;
  choices: string[];
  correctAnswer: string;
  explanation: string;
};

export type KnowledgeAssessment = {
  id: string;
  title: string;
  questions: AssessmentQuestion[];
};
