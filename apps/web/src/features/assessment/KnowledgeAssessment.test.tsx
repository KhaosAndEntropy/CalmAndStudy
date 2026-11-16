// @vitest-environment jsdom
import { fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import type { KnowledgeAssessment as AssessmentData } from '@calmandstudy/content';
import { KnowledgeAssessment } from './KnowledgeAssessment';

const assessment: AssessmentData = {
  id: 'article:test-assessment',
  title: 'Revisão do artigo',
  questions: Array.from({ length: 5 }, (_, index) => ({
    id: `test-q${index + 1}`,
    prompt: `Pergunta ${index + 1}?`,
    choices: ['Resposta correta', 'Alternativa B', 'Alternativa C', 'Alternativa D'],
    correctAnswer: 'Resposta correta',
    explanation: `Explicação da questão ${index + 1}.`,
    difficulty: index < 2 ? 'initial' : index < 4 ? 'developing' : 'challenge',
  })),
};

afterEach(() => window.localStorage.clear());

describe('KnowledgeAssessment', () => {
  it('impede o envio incompleto e calcula nota, feedback e melhor resultado', () => {
    render(<KnowledgeAssessment assessment={assessment} />);
    const submit = screen.getByRole('button', { name: /Ver minha nota/ });

    expect(submit.hasAttribute('disabled')).toBe(true);
    const firstQuestion = screen.getByRole('group', { name: /Pergunta 1\?/ });
    fireEvent.click(within(firstQuestion).getByRole('radio', { name: /Resposta correta/ }));
    expect(submit.hasAttribute('disabled')).toBe(true);

    for (let index = 1; index < assessment.questions.length; index += 1) {
      const question = screen.getByRole('group', {
        name: new RegExp(`Pergunta ${index + 1}\\?`),
      });
      fireEvent.click(within(question).getByRole('radio', { name: /Resposta correta/ }));
    }
    expect(submit.hasAttribute('disabled')).toBe(false);
    fireEvent.click(submit);

    expect(screen.getByText('10')).toBeTruthy();
    expect(screen.getByText('10 de 10 pontos · 100% de acertos')).toBeTruthy();
    expect(screen.getAllByText(/Correto\./)).toHaveLength(5);
    expect(window.localStorage.getItem('calmandstudy-assessment:article:test-assessment')).toBe(
      '10',
    );
    expect(screen.getByText('Melhor nota: 10/10')).toBeTruthy();
  });

  it('inicia prova de trilha fechada e permite expandir sem ocupar a tela', () => {
    render(<KnowledgeAssessment assessment={assessment} collapsible />);
    const disclosure = screen.getByText('Fazer prova da trilha · 5 questões').closest('details');

    expect(disclosure?.open).toBe(false);
    fireEvent.click(screen.getByText('Fazer prova da trilha · 5 questões'));
    expect(disclosure?.open).toBe(true);
    expect(screen.getByRole('heading', { name: 'Revisão do artigo' })).toBeTruthy();
  });
});
