import type { AssessmentQuestion, KnowledgeAssessment, StudyPath, Topic, Tutorial } from './types';

const normalize = (value: string) => value.trim().replace(/\s+/g, ' ').toLocaleLowerCase('pt-BR');

function compactText(value: string): string {
  const normalized = value.trim().replace(/\s+/g, ' ');
  const firstSentence = normalized.split(/(?<=[.!?])\s+/)[0] ?? normalized;
  return firstSentence.length <= 220 ? firstSentence : `${firstSentence.slice(0, 217).trimEnd()}…`;
}

function hash(value: string): number {
  let result = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    result ^= value.charCodeAt(index);
    result = Math.imul(result, 16777619);
  }
  return result >>> 0;
}

function shuffled<T>(values: T[], seed: string): T[] {
  const result = [...values];
  let state = hash(seed) || 1;
  for (let index = result.length - 1; index > 0; index -= 1) {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    const target = state % (index + 1);
    [result[index], result[target]] = [result[target], result[index]];
  }
  return result;
}

function question(
  assessmentId: string,
  index: number,
  prompt: string,
  correctAnswer: string,
  distractors: string[],
  explanation: string,
  difficulty: AssessmentQuestion['difficulty'],
): AssessmentQuestion {
  const correct = compactText(correctAnswer);
  const choices = [
    ...new Map(
      [correct, ...distractors]
        .map(compactText)
        .filter(Boolean)
        .map(value => [normalize(value), value] as const),
    ).values(),
  ].slice(0, 4);
  if (choices.length < 4) {
    const fallbacks = [
      'O texto não apresenta essa informação.',
      'A resposta depende de uma evidência que o conteúdo não afirma.',
      'Nenhuma das outras alternativas está sustentada pelo conteúdo.',
    ];
    for (const fallback of fallbacks) {
      if (choices.length >= 4) break;
      if (!choices.some(value => normalize(value) === normalize(fallback))) choices.push(fallback);
    }
  }
  const orderedChoices = shuffled(choices, `${assessmentId}:${index}:${prompt}`);
  return {
    id: `${assessmentId}-q${index + 1}`,
    prompt,
    choices: orderedChoices,
    correctAnswer: correct,
    explanation,
    difficulty,
  };
}

function otherValues<T>(items: T[], current: T, select: (item: T) => string): string[] {
  return items
    .filter(item => item !== current)
    .map(select)
    .filter(value => value?.trim());
}

function topicQuestion(
  assessmentId: string,
  index: number,
  prompt: string,
  answer: string,
  distractors: string[],
  explanation: string,
  difficulty: AssessmentQuestion['difficulty'],
) {
  return question(assessmentId, index, prompt, answer, distractors, explanation, difficulty);
}

export function buildTopicAssessment(topic: Topic, catalogue: Topic[]): KnowledgeAssessment {
  const id = `article:${topic.id}`;
  const otherTopics = catalogue.filter(item => item.id !== topic.id);
  const factOptions = otherValues(otherTopics, topic, item => item.fact);
  const summaryOptions = otherValues(otherTopics, topic, item => item.summary);
  const detailOptions = otherValues(otherTopics, topic, item => item.detail);
  const context = `${topic.field} · ${topic.period}`;
  const contextOptions = otherTopics.map(item => `${item.field} · ${item.period}`);
  const tagOptions = otherTopics.flatMap(item => item.tags);

  return {
    id,
    title: 'Revisão do artigo',
    questions: [
      topicQuestion(
        id,
        0,
        'Qual palavra-chave está ligada a este tema?',
        topic.tags[0] ?? topic.field,
        tagOptions,
        'As palavras-chave do artigo ajudam a localizar os conceitos relacionados ao tema.',
        'initial',
      ),
      topicQuestion(
        id,
        1,
        'A qual área e período este artigo está associado?',
        context,
        contextOptions,
        `O artigo aparece em ${context}.`,
        'initial',
      ),
      topicQuestion(
        id,
        2,
        'Qual alternativa resume o assunto deste artigo?',
        topic.summary,
        summaryOptions,
        'O resumo retoma o foco que o artigo desenvolve.',
        'developing',
      ),
      topicQuestion(
        id,
        3,
        'Que explicação aparece no desenvolvimento do artigo?',
        topic.detail,
        detailOptions,
        'A resposta está no desenvolvimento do artigo; releia o parágrafo principal se precisar.',
        'developing',
      ),
      topicQuestion(
        id,
        4,
        `Qual ideia central o artigo “${topic.title}” apresenta?`,
        topic.fact,
        factOptions,
        'Esta é a ideia principal apresentada na seção “A descoberta”.',
        'challenge',
      ),
    ],
  };
}

export function buildStudyPathAssessment(path: StudyPath, catalogue: Topic[]): KnowledgeAssessment {
  const linkedTopics = path.topicIds
    .map(id => catalogue.find(topic => topic.id === id))
    .filter((topic): topic is Topic => Boolean(topic));
  const id = `trail:${path.id}`;
  const facts = linkedTopics.map(topic => topic.fact);
  const summaries = linkedTopics.map(topic => topic.summary);
  const details = linkedTopics.map(topic => topic.detail);
  const questions = Array.from({ length: 5 }, (_, index) => {
    const topicIndex =
      linkedTopics.length > 1 ? Math.round((index * (linkedTopics.length - 1)) / 4) : 0;
    const topic = linkedTopics[topicIndex];
    if (!topic) {
      return question(
        id,
        index,
        `Qual afirmação resume a trilha “${path.title}”?`,
        path.description,
        [],
        'A trilha ainda não tem artigos vinculados suficientes para perguntas específicas.',
        index < 2 ? 'initial' : index < 4 ? 'developing' : 'challenge',
      );
    }
    const answerIndex = Math.floor(index / Math.max(1, linkedTopics.length / 2)) % 3;
    const answer =
      answerIndex === 1 ? topic.summary : answerIndex === 2 ? topic.detail : topic.fact;
    const pool = [...facts, ...summaries, ...details].filter(
      value => normalize(value) !== normalize(answer),
    );
    return question(
      id,
      index,
      `Na trilha “${path.title}”, o que o artigo “${topic.title}” ensina?`,
      answer,
      pool,
      `Este ponto pertence ao artigo “${topic.title}”, uma das etapas da trilha.`,
      index < 2 ? 'initial' : index < 4 ? 'developing' : 'challenge',
    );
  });
  return { id, title: 'Prova da trilha', questions };
}

export function buildTutorialAssessment(
  tutorial: Tutorial,
  tutorialCatalogue: Tutorial[],
): KnowledgeAssessment {
  const id = `tutorial:${tutorial.id}`;
  const otherTutorials = tutorialCatalogue.filter(item => item.id !== tutorial.id);
  const steps = tutorial.steps;
  const nextStep = steps[1]?.title ?? tutorial.wrapUp;
  const selectedStep = steps[Math.min(2, Math.max(0, steps.length - 1))]?.title ?? nextStep;
  return {
    id,
    title: 'Revisão do tutorial',
    questions: [
      question(
        id,
        0,
        'Qual é o objetivo deste tutorial?',
        tutorial.description,
        otherTutorials.map(item => item.description),
        'O objetivo é apresentado logo no início do tutorial.',
        'initial',
      ),
      question(
        id,
        1,
        'Qual material é indicado para realizar a atividade?',
        tutorial.materials[0] ?? 'Acompanhar as etapas e registrar as observações.',
        [...otherTutorials.flatMap(item => item.materials)],
        'A lista de materiais do próprio tutorial indica o que será necessário.',
        'initial',
      ),
      question(
        id,
        2,
        'Qual etapa faz parte deste tutorial?',
        selectedStep,
        otherTutorials.flatMap(item => item.steps.map(step => step.title)),
        'Esta etapa aparece na sequência de instruções do tutorial.',
        'developing',
      ),
      question(
        id,
        3,
        `Qual etapa vem depois de “${steps[0]?.title ?? 'começar'}”?`,
        nextStep,
        [
          ...steps.slice(2).map(item => item.title),
          ...otherTutorials.flatMap(item => item.steps.map(step => step.title)),
        ],
        'Seguir a ordem ajuda a aplicar o método proposto no tutorial.',
        'developing',
      ),
      question(
        id,
        4,
        'Que ideia o fechamento deste tutorial reforça?',
        tutorial.wrapUp,
        otherTutorials.map(item => item.wrapUp),
        'A conclusão retoma o aprendizado que a atividade pretende deixar.',
        'challenge',
      ),
    ],
  };
}
