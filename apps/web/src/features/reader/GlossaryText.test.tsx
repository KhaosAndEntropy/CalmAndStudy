// @vitest-environment jsdom
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { GlossaryText } from './GlossaryText';

describe('GlossaryText', () => {
  it('explica termos técnicos por toque e permite fechar a dica pelo teclado', () => {
    render(<GlossaryText>Um dia sideral mede uma rotação em relação às estrelas.</GlossaryText>);

    const term = screen.getByRole('button', { name: 'Explicação de dia sideral' });
    expect(
      screen.getByText(/completar uma rotação em relação às estrelas distantes/i),
    ).toBeTruthy();
    expect(term.getAttribute('aria-expanded')).toBe('false');

    fireEvent.click(term);
    expect(term.getAttribute('aria-expanded')).toBe('true');

    fireEvent.keyDown(term, { key: 'Escape' });
    expect(term.getAttribute('aria-expanded')).toBe('false');
  });

  it('mantém texto comum e termos sem definição como texto legível', () => {
    render(<GlossaryText>Uma ideia simples com palavra desconhecida.</GlossaryText>);

    expect(screen.getByText('Uma ideia simples com palavra desconhecida.')).toBeTruthy();
    expect(screen.queryByRole('button')).toBeNull();
  });
});
