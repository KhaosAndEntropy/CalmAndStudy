// @vitest-environment jsdom
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { LearningModePicker } from './LearningModePicker';
import { isLearningMode } from './learning-mode';

describe('seleção de modo de estudo', () => {
  it('reconhece apenas modos válidos', () => {
    expect(isLearningMode('calm')).toBe(true);
    expect(isLearningMode('adventure')).toBe(true);
    expect(isLearningMode('automatic')).toBe(false);
    expect(isLearningMode(null)).toBe(false);
  });

  it('comunica a escolha acessivelmente e fecha o seletor após a alteração', () => {
    const onChange = vi.fn();
    render(<LearningModePicker mode="calm" onChange={onChange} />);
    const picker = screen.getByText('Calmo').closest('details');
    fireEvent.click(screen.getByRole('button', { name: /Modo aventura/ }));
    expect(onChange).toHaveBeenCalledWith('adventure');
    expect(picker?.open).toBe(false);
    expect(screen.getByRole('button', { name: /Estudo calmo/ }).getAttribute('aria-pressed')).toBe(
      'true',
    );
  });
});
