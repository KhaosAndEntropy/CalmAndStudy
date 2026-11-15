import type { LearningMode } from '../preferences/learning-mode';

export type ContextRecommendation = {
  mode: LearningMode | null;
  mentionsDistress: boolean;
};

const calmSignals = [
  'calma',
  'tranquil',
  'silenc',
  'foco',
  'cansad',
  'devagar',
  'leve',
  'sem pressa',
  'ansios',
  'ansiedad',
  'trist',
  'sobrecarreg',
  'depress',
  'medo',
  'estress',
  'difícil',
  'dificil',
];

const adventureSignals = [
  'jogar',
  'jogo',
  'divert',
  'desafio',
  'animad',
  'energia',
  'dinâmic',
  'dinamic',
  'gamific',
  'aventura',
  'brincar',
  'interativ',
];

const distressSignals = [
  'ansios',
  'ansiedad',
  'trist',
  'sobrecarreg',
  'depress',
  'medo',
  'estress',
  'solitari',
  'sozinh',
  'sofr',
  'luto',
  'pânico',
  'panico',
];

function normalize(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('pt-BR');
}

function countSignals(text: string, signals: string[]) {
  return signals.filter(signal => text.includes(normalize(signal))).length;
}

/** Local, temporary heuristic. It never diagnoses, persists, or sends the text anywhere. */
export function recommendModeFromContext(value: string): ContextRecommendation {
  const text = normalize(value.trim());
  const mentionsDistress = countSignals(text, distressSignals) > 0;

  if (mentionsDistress) return { mode: 'calm', mentionsDistress };

  const calm = countSignals(text, calmSignals);
  const adventure = countSignals(text, adventureSignals);

  if (calm > adventure) return { mode: 'calm', mentionsDistress };
  if (adventure > calm) return { mode: 'adventure', mentionsDistress };
  return { mode: null, mentionsDistress };
}
