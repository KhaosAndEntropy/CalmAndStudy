// @vitest-environment jsdom
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { AppearancePanel, appearancePalettes } from './AppearancePanel';

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
    fireEvent.click(screen.getByRole('button', { name: /^Lavanda:/ }));

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

  it('expõe e aplica todas as paletas, inclusive conforto e alto contraste', () => {
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

    expect(screen.getByRole('heading', { name: 'Acolhedoras' })).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'Baixa luz e contraste' })).toBeTruthy();
    for (const palette of appearancePalettes) {
      const choice = screen.getByRole('button', {
        name: `${palette.name}: ${palette.description}`,
      });
      fireEvent.click(choice);
      expect(onChange).toHaveBeenLastCalledWith('palette', palette.id);
    }
  });

  it('mantém os sons desligados por padrão e permite ligar e ajustar o volume', () => {
    const onAmbientModeChange = vi.fn();
    const onAmbientVolumeChange = vi.fn();
    const view = render(
      <AppearancePanel
        palette="sage"
        layout="comfortable"
        font="sans"
        fontSize="normal"
        ambientMode="off"
        onChange={vi.fn()}
        onAmbientModeChange={onAmbientModeChange}
        onAmbientVolumeChange={onAmbientVolumeChange}
        onClose={vi.fn()}
      />,
    );

    expect(screen.getByRole('button', { name: 'Silêncio' }).getAttribute('aria-pressed')).toBe(
      'true',
    );
    expect(screen.getByText(/não existe um som ideal para todo mundo/i)).toBeTruthy();
    expect(
      screen.getByRole('link', { name: /consultar o estudo sobre música de fundo/i }),
    ).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: /Chuva suave/ }));
    expect(onAmbientModeChange).toHaveBeenCalledWith('rain');
    view.rerender(
      <AppearancePanel
        palette="sage"
        layout="comfortable"
        font="sans"
        fontSize="normal"
        ambientMode="rain"
        onChange={vi.fn()}
        onAmbientModeChange={onAmbientModeChange}
        onAmbientVolumeChange={onAmbientVolumeChange}
        onClose={vi.fn()}
      />,
    );
    fireEvent.change(screen.getByRole('slider', { name: 'Volume do ambiente sonoro' }), {
      target: { value: '0.12' },
    });
    expect(onAmbientVolumeChange).toHaveBeenCalledWith(0.12);
  });
});
