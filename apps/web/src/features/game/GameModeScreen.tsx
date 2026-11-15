import { useMemo, useState, type FormEvent } from 'react';
import {
  ArrowRight,
  BookOpen,
  Check,
  Gamepad2,
  GraduationCap,
  History,
  LockKeyhole,
  RotateCcw,
  Sparkles,
  Trophy,
} from 'lucide-react';
import {
  buildStudyPathAssessment,
  buildTopicAssessment,
  buildTutorialAssessment,
  type KnowledgeAssessment,
  type StudyPath,
  type Topic,
  type Tutorial,
} from '@calmandstudy/content';

type GameTrackId = 'articles' | 'trails' | 'tutorials';
type GameProgress = { passed: string[]; bestScores: Record<string, number> };
type GameStage = { id: string; type: string; title: string; assessment: KnowledgeAssessment };
type GameTrack = {
  id: GameTrackId;
  title: string;
  description: string;
  icon: typeof BookOpen;
  stages: GameStage[];
};
type AttemptResult = { stageId: string; score: number; correct: number; passed: boolean };

const storageKey = 'calmandstudy-game-progress-v1';

function readProgress(validStageIds: ReadonlySet<string>): GameProgress {
  try {
    const parsed: unknown = JSON.parse(window.localStorage.getItem(storageKey) ?? 'null');
    if (!parsed || typeof parsed !== 'object') return { passed: [], bestScores: {} };
    const value = parsed as Record<string, unknown>;
    return {
      passed: Array.isArray(value.passed)
        ? [
            ...new Set(
              value.passed.filter(
                (id): id is string => typeof id === 'string' && validStageIds.has(id),
              ),
            ),
          ]
        : [],
      bestScores:
        value.bestScores && typeof value.bestScores === 'object'
          ? (Object.fromEntries(
              Object.entries(value.bestScores as Record<string, unknown>)
                .filter(
                  ([id, score]) =>
                    validStageIds.has(id) &&
                    typeof score === 'number' &&
                    Number.isFinite(score) &&
                    score >= 0 &&
                    score <= 10,
                )
                .slice(0, 1000),
            ) as Record<string, number>)
          : {},
    };
  } catch {
    return { passed: [], bestScores: {} };
  }
}

function rankFor(passed: number) {
  if (passed >= 100) return 'Mestre curioso';
  if (passed >= 50) return 'Especialista';
  if (passed >= 20) return 'Investigador';
  if (passed >= 5) return 'Explorador';
  return 'Curioso';
}

export function GameModeScreen({
  topics,
  trails,
  tutorials,
}: {
  topics: Topic[];
  trails: StudyPath[];
  tutorials: Tutorial[];
}) {
  const tracks = useMemo<GameTrack[]>(
    () => [
      {
        id: 'articles',
        title: 'Descobertas',
        description: 'Fixe as ideias centrais de cada artigo.',
        icon: BookOpen,
        stages: topics.map(topic => ({
          id: `article:${topic.id}`,
          type: 'Artigo',
          title: topic.title,
          assessment: buildTopicAssessment(topic, topics),
        })),
      },
      {
        id: 'trails',
        title: 'Conexões',
        description: 'Relacione os assuntos e aprenda em sequência.',
        icon: History,
        stages: trails.map(trail => ({
          id: `trail:${trail.id}`,
          type: 'Trilha',
          title: trail.title,
          assessment: buildStudyPathAssessment(trail, topics),
        })),
      },
      {
        id: 'tutorials',
        title: 'Prática',
        description: 'Aplique os métodos e revise cada tutorial.',
        icon: GraduationCap,
        stages: tutorials.map(tutorial => ({
          id: `tutorial:${tutorial.id}`,
          type: 'Tutorial',
          title: tutorial.title,
          assessment: buildTutorialAssessment(tutorial, tutorials),
        })),
      },
    ],
    [topics, trails, tutorials],
  );
  const validStageIds = useMemo(
    () => new Set(tracks.flatMap(item => item.stages.map(stageItem => stageItem.id))),
    [tracks],
  );
  const [progress, setProgress] = useState<GameProgress>(() => readProgress(validStageIds));
  const [trackId, setTrackId] = useState<GameTrackId>('articles');
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<AttemptResult | null>(null);
  const track = tracks.find(item => item.id === trackId) ?? tracks[0];
  const passedIds = new Set(progress.passed);
  const stageIndex = track.stages.findIndex(stage => !passedIds.has(stage.id));
  const stage = stageIndex < 0 ? null : track.stages[stageIndex];
  const completedInTrack = track.stages.filter(item => passedIds.has(item.id)).length;
  const passedCount = progress.passed.length;
  const xp =
    passedCount * 50 + Object.values(progress.bestScores).filter(score => score === 10).length * 10;
  const answeredCount =
    stage?.assessment.questions.filter(question => answers[question.id]).length ?? 0;

  const changeTrack = (id: GameTrackId) => {
    setTrackId(id);
    setAnswers({});
    setResult(null);
  };
  const saveProgress = (update: (current: GameProgress) => GameProgress) => {
    setProgress(current => {
      const next = update(current);
      try {
        window.localStorage.setItem(storageKey, JSON.stringify(next));
      } catch {
        // A rodada permanece funcional mesmo se o navegador bloquear o armazenamento local.
      }
      return next;
    });
  };
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!stage || answeredCount !== stage.assessment.questions.length) return;
    const correct = stage.assessment.questions.filter(
      question => answers[question.id] === question.correctAnswer,
    ).length;
    const score = correct * 2;
    const passed = score >= 8;
    setResult({ stageId: stage.id, score, correct, passed });
    if (passed) {
      saveProgress(current => ({
        passed: current.passed.includes(stage.id) ? current.passed : [...current.passed, stage.id],
        bestScores: {
          ...current.bestScores,
          [stage.id]: Math.max(current.bestScores[stage.id] ?? 0, score),
        },
      }));
    }
  };

  return (
    <div className="game-page">
      <section className="welcome compact game-welcome">
        <div className="eyebrow">
          <Gamepad2 size={15} aria-hidden="true" /> APRENDER JOGANDO
        </div>
        <h1>
          Uma fase de cada vez.
          <br />
          <em>Conhecimento que fica.</em>
        </h1>
        <p>
          Responda às provas de artigos, trilhas e tutoriais. Acerte pelo menos 4 de 5 para liberar
          a próxima fase da jornada escolhida.
        </p>
      </section>

      <section className="game-scoreboard" aria-label="Seu progresso geral">
        <div className="game-rank-mark">
          <Trophy size={20} aria-hidden="true" />
        </div>
        <div className="game-rank-copy">
          <span>SEU NÍVEL</span>
          <strong>{rankFor(passedCount)}</strong>
        </div>
        <div className="game-stat">
          <b>{xp.toLocaleString('pt-BR')}</b>
          <span>pontos de jornada</span>
        </div>
        <div className="game-stat">
          <b>{passedCount}</b>
          <span>fases vencidas</span>
        </div>
      </section>

      <section className="game-tracks" aria-label="Jornadas disponíveis">
        {tracks.map(item => {
          const Icon = item.icon;
          const finished = item.stages.filter(candidate => passedIds.has(candidate.id)).length;
          const selected = item.id === trackId;
          return (
            <button
              type="button"
              key={item.id}
              className={`game-track-card ${selected ? 'is-selected' : ''}`}
              aria-pressed={selected}
              onClick={() => changeTrack(item.id)}
            >
              <span className="game-track-icon">
                <Icon size={19} aria-hidden="true" />
              </span>
              <span className="game-track-info">
                <b>{item.title}</b>
                <small>{item.description}</small>
              </span>
              <span className="game-track-progress">
                {finished}/{item.stages.length}
              </span>
            </button>
          );
        })}
      </section>

      <section className="game-phase" aria-labelledby="game-phase-title">
        {result?.passed ? (
          <div className="game-outcome game-outcome-passed" role="status" aria-live="polite">
            <span className="game-outcome-icon">
              <Check size={23} aria-hidden="true" />
            </span>
            <div>
              <span className="eyebrow">FASE CONCLUÍDA · +50 PONTOS</span>
              <h2 id="game-phase-title">Boa! Você avançou.</h2>
              <p>
                {result.correct} de 5 respostas certas · nota {result.score}/10. A próxima fase já
                está liberada.
              </p>
              <button
                className="primary"
                onClick={() => {
                  setResult(null);
                  setAnswers({});
                }}
              >
                {stage ? 'Ir para a próxima fase' : 'Ver jornada concluída'}{' '}
                <ArrowRight size={15} aria-hidden="true" />
              </button>
            </div>
          </div>
        ) : stage ? (
          <>
            {result && !result.passed && (
              <div className="game-failed-note" role="status" aria-live="polite">
                <RotateCcw size={17} aria-hidden="true" />
                <span>
                  <b>Nota {result.score}/10.</b> Para liberar a próxima fase, você precisa de 8
                  pontos. Veja as explicações e tente novamente.
                </span>
              </div>
            )}
            <div className="game-phase-heading">
              <div>
                <span className="eyebrow">
                  {track.title.toLocaleUpperCase('pt-BR')} · FASE {stageIndex + 1} DE{' '}
                  {track.stages.length}
                </span>
                <h2 id="game-phase-title">{stage.title}</h2>
              </div>
              <span className="game-phase-kind">{stage.type}</span>
            </div>
            <div
              className="game-track-meter"
              role="progressbar"
              aria-label={`Progresso da jornada ${track.title}`}
              aria-valuemin={0}
              aria-valuemax={track.stages.length}
              aria-valuenow={completedInTrack}
            >
              <span
                style={{
                  width: `${track.stages.length ? (completedInTrack / track.stages.length) * 100 : 0}%`,
                }}
              />
            </div>
            <form className="game-quiz" onSubmit={submit}>
              <p className="game-quiz-instruction">
                <Sparkles size={15} aria-hidden="true" /> Responda às cinco questões. Você precisa
                acertar pelo menos quatro para passar.
              </p>
              {stage.assessment.questions.map((question, questionIndex) => (
                <fieldset className="game-question" key={question.id}>
                  <legend>
                    <span>{String(questionIndex + 1).padStart(2, '0')}</span>
                    {question.prompt}
                  </legend>
                  <div className="game-choices">
                    {question.choices.map(choice => {
                      const selected = answers[question.id] === choice;
                      const isCorrect = choice === question.correctAnswer;
                      const reviewClass = result
                        ? isCorrect
                          ? ' is-correct'
                          : selected
                            ? ' is-wrong'
                            : ''
                        : '';
                      return (
                        <label
                          className={`game-choice${selected ? ' is-selected' : ''}${reviewClass}`}
                          key={choice}
                        >
                          <input
                            type="radio"
                            name={question.id}
                            value={choice}
                            checked={selected}
                            disabled={Boolean(result)}
                            onChange={() =>
                              setAnswers(current => ({ ...current, [question.id]: choice }))
                            }
                          />
                          <span className="game-choice-marker" aria-hidden="true">
                            {result && isCorrect ? <Check size={13} /> : null}
                          </span>
                          <span>{choice}</span>
                        </label>
                      );
                    })}
                  </div>
                  {result && (
                    <p className="game-explanation">
                      <b>
                        {answers[question.id] === question.correctAnswer
                          ? 'Certo.'
                          : 'Para lembrar:'}
                      </b>{' '}
                      {question.explanation}
                    </p>
                  )}
                </fieldset>
              ))}
              {!result && (
                <div className="game-submit-row">
                  <span aria-live="polite">{answeredCount} de 5 respondidas</span>
                  <button className="primary" type="submit" disabled={answeredCount !== 5}>
                    Conferir respostas <ArrowRight size={15} aria-hidden="true" />
                  </button>
                </div>
              )}
            </form>
            {result && !result.passed && (
              <div className="game-submit-row game-retry-row">
                <span>Esta fase continua aberta para revisão.</span>
                <button
                  className="outline-btn"
                  onClick={() => {
                    setResult(null);
                    setAnswers({});
                  }}
                >
                  Tentar novamente <RotateCcw size={14} aria-hidden="true" />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="game-finished" role="status">
            <span className="game-outcome-icon">
              <Trophy size={22} aria-hidden="true" />
            </span>
            <span className="eyebrow">JORNADA CONCLUÍDA</span>
            <h2>Você percorreu todas as fases de {track.title.toLocaleLowerCase('pt-BR')}.</h2>
            <p>Volte às leituras a qualquer momento ou escolha outra jornada para continuar.</p>
          </div>
        )}
      </section>
      <p className="game-storage-note">
        <LockKeyhole size={13} aria-hidden="true" /> Seu avanço e suas pontuações ficam salvos
        somente neste dispositivo.
      </p>
    </div>
  );
}
