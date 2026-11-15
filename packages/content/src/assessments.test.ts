import { describe, expect, it } from 'vitest';
import {
  buildStudyPathAssessment,
  buildTopicAssessment,
  buildTutorialAssessment,
} from './assessments';
import { topics, studyPaths, tutorials } from './index';

describe('avaliações do catálogo', () => {
  it('gera cinco questões reproduzíveis, com quatro alternativas distintas e resposta correta', () => {
    for (const topic of topics) {
      const assessment = buildTopicAssessment(topic, topics);
      expect(assessment.questions).toHaveLength(5);
      expect(buildTopicAssessment(topic, topics)).toEqual(assessment);
      for (const question of assessment.questions) {
        expect(question.choices).toHaveLength(4);
        expect(
          new Set(question.choices.map(choice => choice.toLocaleLowerCase('pt-BR'))).size,
        ).toBe(4);
        expect(question.choices).toContain(question.correctAnswer);
        expect(question.explanation.trim()).not.toBe('');
      }
    }
  });

  it('constrói provas para todas as trilhas e tutoriais mesmo com referências parciais', () => {
    for (const path of studyPaths) {
      expect(buildStudyPathAssessment(path, topics).questions).toHaveLength(5);
    }
    for (const tutorial of tutorials) {
      expect(buildTutorialAssessment(tutorial, tutorials).questions).toHaveLength(5);
    }
  });
});
