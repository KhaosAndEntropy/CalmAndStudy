// @vitest-environment jsdom
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { AppearancePanel } from './AppearancePanel';

describe('AppearancePanel', () => {
  it('avisa quando a pessoa escolhe outra paleta', () => {
    const onChange = vi.fn();

    render(
      <AppearancePanel
        palette="sage"
        layout="comfortable"
        font="sans"
        fontSize="normal"
        onChange={onChange}
        onClose={vi.fn()}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Lavanda' }));

    expect(onChange).toHaveBeenCalledWith('palette', 'lavender');
  });

  it('permite mudar o layout e aumentar o texto', () => {
    const onChange = vi.fn();

    render(
      <AppearancePanel
        palette="sage"
        layout="comfortable"
        font="sans"
        fontSize="normal"
        onChange={onChange}
        onClose={vi.fn()}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: /Compacto/ }));
    fireEvent.click(screen.getByRole('button', { name: 'Tamanho do texto: Grande' }));

    expect(onChange).toHaveBeenNthCalledWith(1, 'layout', 'compact');
    expect(onChange).toHaveBeenNthCalledWith(2, 'fontSize', 'large');
  });
});
