// @vitest-environment jsdom
import { fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { buildTopicAssessment, topics } from '@calmandstudy/content';
import { GameModeScreen } from './GameModeScreen';

afterEach(() => window.localStorage.clear());

describe('GameModeScreen', () => {
  it('mantém uma fase sem liberar avanço até 4/5, grava aprovação e conclui jornada curta', () => {
    const topic = topics[0]!;
    const assessment = buildTopicAssessment(topic, [topic]);
    render(<GameModeScreen topics={[topic]} trails={[]} tutorials={[]} />);

    const form = screen.getByRole('form', { name: 'Questionário da fase atual' });
    const submit = within(form).getByRole('button', { name: /Conferir respostas/ });
    expect(submit.hasAttribute('disabled')).toBe(true);

    const questions = within(form).getAllByRole('group');
    for (const [index, question] of questions.entries()) {
      const choices = within(question)
        .getAllByRole('radio')
        .map(input => input.getAttribute('value'))
        .filter((value): value is string => Boolean(value));
      const answer =
        index < 4
          ? assessment.questions[index]!.correctAnswer
          : choices.find(item => item !== assessment.questions[index]!.correctAnswer);
      if (!answer) throw new Error('Questão sem alternativa para responder.');
      fireEvent.click(within(question).getByRole('radio', { name: answer }));
    }
    fireEvent.click(submit);
    expect(screen.getByText(/4 de 5 respostas certas/)).toBeTruthy();
    expect(window.localStorage.getItem('calmandstudy-game-progress-v1')).toContain(
      `article:${topic.id}`,
    );
    fireEvent.click(screen.getByRole('button', { name: /Ver jornada concluída/ }));
    expect(screen.getByText(/JORNADA CONCLUÍDA/)).toBeTruthy();
  });

  it('ignora progresso local malformado e permite repetir uma fase reprovada', () => {
    window.localStorage.setItem('calmandstudy-game-progress-v1', '{bad json');
    const topic = topics[0]!;
    const assessment = buildTopicAssessment(topic, [topic]);
    render(<GameModeScreen topics={[topic]} trails={[]} tutorials={[]} />);

    const form = screen.getByRole('form', { name: 'Questionário da fase atual' });
    const questions = within(form).getAllByRole('group');
    for (const [index, question] of questions.entries()) {
      const wrong = within(question)
        .getAllByRole('radio')
        .map(input => input.getAttribute('value'))
        .find(value => value !== assessment.questions[index]!.correctAnswer);
      if (!wrong) throw new Error('Questão sem alternativa incorreta.');
      fireEvent.click(within(question).getByRole('radio', { name: wrong }));
    }
    fireEvent.click(within(form).getByRole('button', { name: /Conferir respostas/ }));
    expect(screen.getByText(/Nota 0\/10/)).toBeTruthy();
    expect(window.localStorage.getItem('calmandstudy-game-progress-v1')).toBe('{bad json');
    fireEvent.click(screen.getByRole('button', { name: /Tentar novamente/ }));
    expect(screen.getByText('0 de 5 respondidas')).toBeTruthy();
  });
});
