import { ArrowRight, Check, X } from 'lucide-react';
import type { Tutorial } from '@calmandstudy/content';
import { buildTutorialAssessment, tutorials } from '@calmandstudy/content';
import { KnowledgeAssessment } from '../assessment/KnowledgeAssessment';

type TutorialDialogProps = {
  tutorial: Tutorial;
  step: number;
  completedSteps: number[];
  onClose: () => void;
  onComplete: () => void;
  onStepChange: (update: (step: number) => number) => void;
  onToggleStep: (index: number) => void;
};

export function TutorialDialog({
  tutorial,
  step,
  completedSteps,
  onClose,
  onComplete,
  onStepChange,
  onToggleStep,
}: TutorialDialogProps) {
  const progress = tutorial.steps.length
    ? Math.round((completedSteps.length / tutorial.steps.length) * 100)
    : 0;
  const lastStepIndex = Math.max(0, tutorial.steps.length - 1);
  const isComplete = tutorial.steps.length > 0 && step >= tutorial.steps.length;
  return (
    <div
      className="overlay"
      onMouseDown={event => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        className="tutorial-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="tutorial-title"
        aria-describedby="tutorial-description"
      >
        <header className="dialog-head">
          <div>
            <span className="eyebrow muted">
              {tutorial.field} · {tutorial.durationMinutes} MIN
            </span>
            <h2 id="tutorial-title">{tutorial.title}</h2>
          </div>
          <button className="icon-btn" aria-label="Fechar tutorial" onClick={onClose}>
            <X size={19} aria-hidden="true" />
          </button>
        </header>
        <p id="tutorial-description" className="tutorial-description">
          {tutorial.description}
        </p>
        <section className="tutorial-materials" aria-labelledby="tutorial-materials-title">
          <b id="tutorial-materials-title">O que você vai precisar</b>
          <ul>
            {tutorial.materials.map(material => (
              <li key={material}>{material}</li>
            ))}
          </ul>
        </section>
        <div className="tutorial-progress" aria-label="Progresso do tutorial">
          <span aria-live="polite" aria-atomic="true">
            {isComplete
              ? 'Tutorial concluído'
              : `Etapa ${Math.min(step + 1, tutorial.steps.length)} de ${tutorial.steps.length}`}
          </span>
          <span>{progress}% das etapas marcadas</span>
          <progress
            className="tutorial-progress-track"
            aria-label="Etapas concluídas"
            max={100}
            value={progress}
          />
        </div>
        <ol className="tutorial-steps-list" aria-label="Etapas do tutorial">
          {tutorial.steps.map((tutorialStep, index) => {
            const done = completedSteps.includes(index);
            return (
              <li
                className={`tutorial-step ${index === step ? 'current' : ''} ${done ? 'done' : ''}`}
                key={tutorialStep.title}
                aria-current={index === step ? 'step' : undefined}
              >
                <span className="step-number" aria-hidden="true">
                  {index + 1}
                </span>
                <div>
                  <h3>{tutorialStep.title}</h3>
                  <p>{tutorialStep.instruction}</p>
                </div>
                <button
                  type="button"
                  aria-label={`${done ? 'Desmarcar' : 'Marcar como concluída'} etapa ${index + 1}: ${
                    tutorialStep.title
                  }`}
                  aria-pressed={done}
                  className="step-check"
                  onClick={() => onToggleStep(index)}
                >
                  {done ? <Check size={16} aria-hidden="true" /> : null}
                </button>
              </li>
            );
          })}
        </ol>
        <div className="tutorial-wrapup">
          <b>Ao terminar</b>
          <p>{tutorial.wrapUp}</p>
        </div>
        {isComplete && (
          <div className="tutorial-complete" role="status">
            <Check size={18} aria-hidden="true" />
            <span>
              <b>Você chegou ao fim deste tutorial.</b>
              <small>Você pode rever a etapa final ou fechar e escolher outro passo a passo.</small>
            </span>
          </div>
        )}
        {tutorial.sources?.length ? (
          <section className="tutorial-sources" aria-label="Fontes para consulta">
            {tutorial.sources.map(source => (
              <a
                className="tutorial-source"
                key={source.url}
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                Fonte para consulta: {source.name} <ArrowRight size={14} aria-hidden="true" />
              </a>
            ))}
          </section>
        ) : null}
        {isComplete && (
          <KnowledgeAssessment assessment={buildTutorialAssessment(tutorial, tutorials)} />
        )}
        <div className="tutorial-dialog-actions">
          {isComplete ? (
            <>
              <button className="outline-btn" onClick={() => onStepChange(() => lastStepIndex)}>
                Rever última etapa
              </button>
              <button className="primary" onClick={onComplete}>
                Concluir tutorial <Check size={15} aria-hidden="true" />
              </button>
            </>
          ) : (
            <>
              <button
                className="outline-btn"
                disabled={step === 0}
                onClick={() => onStepChange(value => Math.max(0, value - 1))}
              >
                Etapa anterior
              </button>
              <button
                className="primary"
                onClick={() => onStepChange(value => Math.min(tutorial.steps.length, value + 1))}
              >
                {step === lastStepIndex ? 'Finalizar tutorial' : 'Próxima etapa'}{' '}
                <ArrowRight size={15} aria-hidden="true" />
              </button>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
