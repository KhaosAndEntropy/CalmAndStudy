// @vitest-environment jsdom
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { WelcomeDialog } from './WelcomeDialog';

describe('WelcomeDialog', () => {
  it('apresenta logo os dois caminhos sem exigir questionário', () => {
    render(
      <WelcomeDialog onClose={vi.fn()} onQuick={vi.fn()} onTour={vi.fn()} onModeSelect={vi.fn()} />,
    );

    expect(screen.getByRole('heading', { name: /como você quer aprender hoje/i })).toBeTruthy();
    expect(screen.getByRole('button', { name: /estudar com calma/i })).toBeTruthy();
    expect(screen.getByRole('button', { name: /explorar jogando/i })).toBeTruthy();
    expect(screen.queryByText(/rodada 1 de 3/i)).toBeNull();
  });

  it('deixa o check-in opcional, temporário e sem bloquear a escolha', () => {
    render(
      <WelcomeDialog onClose={vi.fn()} onQuick={vi.fn()} onTour={vi.fn()} onModeSelect={vi.fn()} />,
    );

    fireEvent.click(screen.getByText(/quer contar como está se sentindo/i));
    const context = screen.getByRole('textbox', { name: /não é uma avaliação/i });
    fireEvent.change(context, { target: { value: 'Quero algo divertido, com jogo e desafios.' } });
    expect(screen.getByText(/talvez o modo aventura combine/i)).toBeTruthy();
    expect(screen.getByRole('button', { name: /explorar jogando/i })).toBeTruthy();
  });

  it('aplica o modo somente após a escolha da pessoa', () => {
    const onClose = vi.fn();
    const onModeSelect = vi.fn();
    render(
      <WelcomeDialog
        onClose={onClose}
        onQuick={vi.fn()}
        onTour={vi.fn()}
        onModeSelect={onModeSelect}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: /explorar jogando/i }));
    expect(onModeSelect).toHaveBeenCalledWith('adventure');
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('oferece apoio somente quando a pessoa opta por compartilhar contexto que indica sofrimento', () => {
    render(
      <WelcomeDialog onClose={vi.fn()} onQuick={vi.fn()} onTour={vi.fn()} onModeSelect={vi.fn()} />,
    );

    fireEvent.click(screen.getByText(/quer contar como está se sentindo/i));
    fireEvent.change(screen.getByRole('textbox', { name: /não é uma avaliação/i }), {
      target: { value: 'Estou triste e ansiosa.' },
    });
    fireEvent.click(screen.getByRole('button', { name: /ver acolhimento e opções de apoio/i }));

    expect(screen.getByText(/você não está só/i)).toBeTruthy();
    expect(screen.getByRole('link', { name: /ligar para o cvv/i })).toBeTruthy();
    expect(screen.getByRole('link', { name: /informações oficiais sobre o samu/i })).toBeTruthy();
  });
});
