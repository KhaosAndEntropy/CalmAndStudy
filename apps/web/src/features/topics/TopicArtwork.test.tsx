// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { topics } from '@calmandstudy/content';
import { TopicArtwork } from './TopicArtwork';

describe('TopicArtwork', () => {
  it('sempre oferece uma ilustração local acessível para o assunto', () => {
    const topic = topics[0];
    const { container } = render(<TopicArtwork topic={topic} mode="card" />);

    expect(screen.getByRole('img', { name: `Ilustração sobre ${topic.title}` })).toBeTruthy();
    expect(container.querySelector('svg')).not.toBeNull();
    expect(container.querySelector('figure')?.classList.contains('topic-image')).toBe(true);
  });
});
