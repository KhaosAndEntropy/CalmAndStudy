// @vitest-environment jsdom
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { studyPaths, topics } from '@calmandstudy/content';
import { StudyPathsScreen } from './StudyPathsScreen';

describe('StudyPathsScreen', () => {
  it('aplica busca e área, mostra progresso e deixa a prova recolhida', () => {
    const path = studyPaths[0];
    const getEngagement = vi.fn(id => ({
      type: 'trail' as const,
      id,
      reads: 0,
      likes: 0,
      liked: false,
    }));
    render(
      <StudyPathsScreen
        paths={studyPaths}
        topics={topics}
        onSelectTopic={vi.fn()}
        engagementAvailable
        getEngagement={getEngagement}
        onToggleLike={vi.fn()}
        onTrackRead={vi.fn()}
      />,
    );

    expect(screen.getByRole('heading', { name: path.title })).toBeTruthy();
    const firstCard = screen.getByRole('heading', { name: path.title }).closest('article');
    expect(firstCard?.querySelector('.assessment-disclosure')?.hasAttribute('open')).toBe(false);
    expect(firstCard?.querySelector('.assessment-disclosure > summary')?.textContent).toBe(
      'Fazer prova da trilha · 5 questões',
    );

    const search = screen.getByRole('searchbox', { name: /Encontre uma trilha/ });
    fireEvent.change(search, { target: { value: path.title } });
    expect(screen.getByText(`1 de ${studyPaths.length} trilhas`)).toBeTruthy();
    expect(screen.queryByRole('heading', { name: studyPaths[1].title })).toBeNull();
  });

  it('abre a etapa e registra leitura antes de selecionar o artigo', () => {
    const path = studyPaths[0];
    const callbacks = { onSelectTopic: vi.fn(), onTrackRead: vi.fn() };
    render(
      <StudyPathsScreen
        paths={[path]}
        topics={topics}
        {...callbacks}
        engagementAvailable={false}
        getEngagement={id => ({ type: 'trail', id, reads: 0, likes: 0, liked: false })}
        onToggleLike={vi.fn()}
      />,
    );

    const linkedTopic = topics.find(topic => topic.id === path.topicIds[0]);
    if (!linkedTopic) throw new Error('A trilha deve apontar para um artigo existente.');
    fireEvent.click(screen.getByRole('button', { name: new RegExp(linkedTopic.title) }));

    expect(callbacks.onTrackRead).toHaveBeenCalledWith(path.id);
    expect(callbacks.onSelectTopic).toHaveBeenCalledWith(linkedTopic);
  });
});
