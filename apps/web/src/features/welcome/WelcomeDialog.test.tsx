// @vitest-environment jsdom
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { WelcomeDialog } from './WelcomeDialog';

describe('WelcomeDialog', () => {
  it('oferece um check-in opcional sem guardar a resposta', () => {
    render(
      <WelcomeDialog onClose={vi.fn()} onQuick={vi.fn()} onTour={vi.fn()} onModeSelect={vi.fn()} />,
    );

    expect(screen.getByText(/como você está chegando hoje/i)).toBeTruthy();
    expect(screen.getByText(/não será salva nem enviada/i)).toBeTruthy();
    expect(screen.getByText(/referências são públicas e gratuitas/i)).toBeTruthy();
    expect(screen.queryByText(/você merece apoio de verdade/i)).toBeNull();
  });

  it('mostra apoio escolhido pela pessoa e permite escolher o modo de estudo', () => {
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

    fireEvent.click(screen.getByRole('button', { name: /estou passando por um momento difícil/i }));
    expect(screen.getByText(/você merece apoio de verdade/i)).toBeTruthy();
    expect(screen.getByRole('link', { name: /ligar para o cvv/i })).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: /continuar para escolher meu ritmo/i }));
    fireEvent.click(screen.getByRole('button', { name: /estudar com calma/i }));
    expect(onClose).toHaveBeenCalledOnce();
    expect(onModeSelect).toHaveBeenCalledWith('calm');
  });

  it('inicia a rodada de aventura somente após a escolha da pessoa', () => {
    render(
      <WelcomeDialog onClose={vi.fn()} onQuick={vi.fn()} onTour={vi.fn()} onModeSelect={vi.fn()} />,
    );
    fireEvent.click(screen.getByRole('button', { name: /prefiro não responder/i }));
    fireEvent.click(screen.getByRole('button', { name: /conhecer jogando/i }));
    expect(screen.getByText(/Rodada 1 de 3/)).toBeTruthy();
  });
});
