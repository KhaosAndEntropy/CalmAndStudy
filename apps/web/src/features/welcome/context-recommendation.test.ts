import { describe, expect, it } from 'vitest';
import { recommendModeFromContext } from './context-recommendation';

describe('recommendModeFromContext', () => {
  it('suggests calm study for a wish to read without pressure', () => {
    expect(recommendModeFromContext('Quero estudar em silêncio e sem pressa.')).toEqual({
      mode: 'calm',
      mentionsDistress: false,
    });
  });

  it('suggests adventure for a wish for games and challenges', () => {
    expect(recommendModeFromContext('Quero aprender jogando com desafios.')).toEqual({
      mode: 'adventure',
      mentionsDistress: false,
    });
  });

  it('prefers a gentle pace and support signposting when distress is mentioned', () => {
    expect(recommendModeFromContext('Estou ansiosa e um pouco sobrecarregada.')).toEqual({
      mode: 'calm',
      mentionsDistress: true,
    });
  });

  it('does not infer a preference from unrelated or ambiguous text', () => {
    expect(recommendModeFromContext('Vim conhecer o projeto.')).toEqual({
      mode: null,
      mentionsDistress: false,
    });
  });
});
