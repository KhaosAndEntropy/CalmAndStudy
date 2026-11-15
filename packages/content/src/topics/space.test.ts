import { describe, expect, it } from 'vitest';
import { spaceTopics } from './space';

const expandedAstronomyTopicIds = [
  'sunlight-travel-time',
  'astronomical-unit',
  'earth-seasons-tilt',
];

describe('novos artigos de Astronomia', () => {
  it('inclui três artigos com três referências públicas listadas e hosts distintos', () => {
    for (const topicId of expandedAstronomyTopicIds) {
      const topic = spaceTopics.find(candidate => candidate.id === topicId);

      expect(topic, `artigo ${topicId} deve existir`).toBeDefined();
      expect(topic?.sources).toHaveLength(3);
      expect(new Set(topic?.sources.map(source => new URL(source.url).hostname)).size).toBe(3);
      expect(topic?.confidenceLabel).toMatch(/revisão editorial humana pendente/i);
    }
  });

  it('explica os limites e ressalvas centrais dos novos textos', () => {
    const solarLight = spaceTopics.find(topic => topic.id === 'sunlight-travel-time');
    const astronomicalUnit = spaceTopics.find(topic => topic.id === 'astronomical-unit');
    const seasons = spaceTopics.find(topic => topic.id === 'earth-seasons-tilt');

    expect(solarLight?.detail).toMatch(/varia/i);
    expect(astronomicalUnit?.detail).toMatch(/órbita.*elíptica/i);
    expect(seasons?.detail).toMatch(/hemisférios opostas|estações opostas/i);
  });
});
