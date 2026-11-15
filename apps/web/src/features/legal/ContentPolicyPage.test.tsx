import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ContentPolicyPage } from './ContentPolicyPage';

describe('ContentPolicyPage', () => {
  it('explica direitos, fontes, imagens de IA e acesso gratuito', () => {
    render(<ContentPolicyPage />);

    expect(screen.getByRole('heading', { name: /conhecimento aberto/i })).toBeTruthy();
    expect(screen.getByRole('heading', { name: /artigos e fontes/i })).toBeTruthy();
    expect(
      screen.getByRole('heading', { name: /imagens e inteligência artificial/i }),
    ).toBeTruthy();
    expect(screen.getByRole('heading', { name: /um projeto aberto/i })).toBeTruthy();
    expect(screen.getByText(/gratuita e aberta à colaboração/i)).toBeTruthy();
  });

  it('abre as referências em nova aba com proteção contra opener', () => {
    render(<ContentPolicyPage />);

    for (const link of screen.getAllByRole('link')) {
      expect(link.getAttribute('target')).toBe('_blank');
      expect(link.getAttribute('rel')).toContain('noopener');
      expect(link.getAttribute('rel')).toContain('noreferrer');
    }
  });
});
