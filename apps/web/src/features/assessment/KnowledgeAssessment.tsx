import { useEffect, useMemo, useState } from 'react';
import { Check, RotateCcw, Send, X } from 'lucide-react';
import type { KnowledgeAssessment as KnowledgeAssessmentData } from '@calmandstudy/content';

type KnowledgeAssessmentProps = {
  assessment: KnowledgeAssessmentData;
  collapsible?: boolean;
};

function readBestScore(id: string): number | null {
  try {
    const saved = window.localStorage.getItem(`calmandstudy-assessment:${id}`);
    if (saved === null) return null;
    const value = Number(saved);
    return Number.isFinite(value) && value >= 0 && value <= 10 ? value : null;
  } catch {
    return null;
  }
}

export function KnowledgeAssessment({ assessment, collapsible = false }: KnowledgeAssessmentProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [bestScore, setBestScore] = useState<number | null>(null);
  const score = useMemo(
    () =>
      assessment.questions.filter(question => answers[question.id] === question.correctAnswer)
        .length * 2,
    [answers, assessment.questions],
  );
  const complete = assessment.questions.length === 5;
  const answeredCount = Object.keys(answers).length;

  useEffect(() => {
    setBestScore(readBestScore(assessment.id));
    setAnswers({});
    setSubmitted(false);
  }, [assessment.id]);

  const submit = () => {
    if (answeredCount !== assessment.questions.length || !complete) return;
    setSubmitted(true);
    setBestScore(previous => {
      const best = Math.max(previous ?? 0, score);
      try {
        window.localStorage.setItem(`calmandstudy-assessment:${assessment.id}`, String(best));
      } catch {
        // A prova continua funcionando quando o navegador bloqueia armazenamento local.
      }
      return best;
    });
  };

  const retry = () => {
    setAnswers({});
    setSubmitted(false);
  };

  const content = (
    <section className="knowledge-assessment" aria-labelledby={`${assessment.id}-title`}>
      <div className="knowledge-assessment-heading">
        <div>
          <span className="eyebrow muted">5 QUESTÕES · NOTA DE 0 A 10</span>
          <h2 id={`${assessment.id}-title`}>{assessment.title}</h2>
        </div>
        {bestScore !== null && <span className="assessment-best">Melhor nota: {bestScore}/10</span>}
      </div>
      <p className="assessment-intro">
        Escolha uma resposta por questão. Ao finalizar, você verá sua nota e poderá conferir cada
        resposta.
      </p>
      <div className="assessment-questions">
        {assessment.questions.map((question, index) => {
          const selectedAnswer = answers[question.id];
          const correct = selectedAnswer === question.correctAnswer;
          return (
            <fieldset className="assessment-question" key={question.id}>
              <legend>
                <span className="assessment-question-number" aria-hidden="true">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="assessment-question-prompt">{question.prompt}</span>
              </legend>
              <div className="assessment-choices">
                {question.choices.map((choice, choiceIndex) => {
                  const isCorrectChoice = choice === question.correctAnswer;
                  const choiceState = submitted
                    ? isCorrectChoice
                      ? ' assessment-choice-correct'
                      : selectedAnswer === choice
                        ? ' assessment-choice-wrong'
                        : ''
                    : '';
                  return (
                    <label
                      className={`assessment-choice${choiceState}`}
                      key={`${choiceIndex}-${choice}`}
                    >
                      <input
                        type="radio"
                        name={question.id}
                        value={choice}
                        checked={selectedAnswer === choice}
                        disabled={submitted}
                        onChange={() =>
                          setAnswers(current => ({ ...current, [question.id]: choice }))
                        }
                      />
                      <span className="assessment-choice-marker" aria-hidden="true">
                        {submitted && isCorrectChoice ? <Check size={13} /> : null}
                        {submitted && selectedAnswer === choice && !isCorrectChoice ? (
                          <X size={13} />
                        ) : null}
                      </span>
                      <span>{choice}</span>
                    </label>
                  );
                })}
              </div>
              {submitted && (
                <p className={`assessment-feedback ${correct ? 'is-correct' : 'is-wrong'}`}>
                  <b>{correct ? 'Correto.' : 'Vamos rever.'}</b> {question.explanation}
                </p>
              )}
            </fieldset>
          );
        })}
      </div>
      {submitted ? (
        <div className="assessment-result" role="status" aria-live="polite">
          <span className="assessment-result-score">
            {score}
            <small>/10</small>
          </span>
          <div>
            <b>
              {score === 10
                ? 'Excelente! Você dominou este conteúdo.'
                : score >= 6
                  ? 'Bom trabalho. O conteúdo está ficando.'
                  : 'Vale reler alguns pontos e tentar de novo.'}
            </b>
            <p>
              {score} de 10 pontos · {Math.round((score / 10) * 100)}% de acertos
            </p>
          </div>
          <button type="button" className="outline-btn" onClick={retry}>
            <RotateCcw size={15} aria-hidden="true" /> Tentar novamente
          </button>
        </div>
      ) : (
        <div className="assessment-submit-row">
          <span aria-live="polite">{answeredCount} de 5 respondidas</span>
          <button
            type="button"
            className="primary"
            onClick={submit}
            disabled={!complete || answeredCount !== 5}
          >
            Ver minha nota <Send size={15} aria-hidden="true" />
          </button>
        </div>
      )}
      <p className="assessment-storage-note">
        Sua melhor nota fica salva somente neste dispositivo.
      </p>
    </section>
  );
  return collapsible ? (
    <details className="assessment-disclosure">
      <summary>Fazer prova da trilha · 5 questões</summary>
      {content}
    </details>
  ) : (
    content
  );
}
