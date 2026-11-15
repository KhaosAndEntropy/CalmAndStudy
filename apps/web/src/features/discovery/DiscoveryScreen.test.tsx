// @vitest-environment jsdom
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { fields, topics } from '@calmandstudy/content';
import { DiscoveryScreen } from './DiscoveryScreen';

function renderDiscovery(overrides: Record<string, unknown> = {}) {
  const topic = topics[0];
  const callbacks = {
    onFieldChange: vi.fn(),
    onQueryChange: vi.fn(),
    onSearchSubmit: vi.fn(),
    onFieldQueryChange: vi.fn(),
    onToggleFilters: vi.fn(),
    onToggleSaved: vi.fn(),
    onToggleRead: vi.fn(),
    onSelectTopic: vi.fn(),
    onRandom: vi.fn(),
    onSuggestTopic: vi.fn(),
    onExplorePaths: vi.fn(),
    countInField: vi.fn(() => 1),
    engagementAvailable: true,
    getEngagement: vi.fn(id => ({
      type: 'article' as const,
      id,
      reads: 0,
      likes: 0,
      liked: false,
    })),
    onToggleLike: vi.fn(),
  };
  const props = {
    topics: [topic],
    matchingTopics: [topic],
    fields,
    matchingFields: fields,
    field: 'Todas',
    query: '',
    fieldQuery: '',
    showFilters: false,
    saved: [],
    readIds: [],
    ...callbacks,
    ...overrides,
  };
  return { ...render(<DiscoveryScreen {...props} />), callbacks, topic };
}

describe('DiscoveryScreen', () => {
  it('exibe os artigos recebidos e chama o sorteio quando solicitado', () => {
    const { callbacks, topic } = renderDiscovery();

    expect(screen.getByRole('heading', { name: topic.title })).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: /Sortear um assunto/ }));

    expect(callbacks.onRandom).toHaveBeenCalledOnce();
  });

  it('encaminha as ações de salvar, abrir um artigo e expandir áreas', () => {
    const { callbacks, topic } = renderDiscovery();
    fireEvent.click(screen.getByRole('button', { name: `Salvar ${topic.title}` }));
    fireEvent.click(screen.getByRole('button', { name: topic.title }));
    fireEvent.click(screen.getByRole('button', { name: /Explorar áreas/ }));

    expect(callbacks.onToggleSaved).toHaveBeenCalledWith(topic.id);
    expect(callbacks.onSelectTopic).toHaveBeenCalledWith(topic);
    expect(callbacks.onToggleFilters).toHaveBeenCalledOnce();
  });

  it('mostra uma orientação útil quando a lista está vazia', () => {
    renderDiscovery({ matchingTopics: [], field: 'Botânica' });

    expect(screen.getByRole('heading', { name: 'Estamos preparando esta área' })).toBeTruthy();
    expect(screen.getByRole('button', { name: /Ver assuntos disponíveis/ })).toBeTruthy();
  });
});
