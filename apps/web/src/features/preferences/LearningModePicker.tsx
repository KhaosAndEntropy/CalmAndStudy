import { useRef } from 'react';
import { BookOpen, ChevronDown, Gamepad2, Sparkles } from 'lucide-react';
import type { LearningMode } from './learning-mode';

export function LearningModePicker({
  mode,
  onChange,
}: {
  mode: LearningMode;
  onChange: (mode: LearningMode) => void;
}) {
  const pickerRef = useRef<HTMLDetailsElement>(null);
  const currentLabel = mode === 'calm' ? 'Estudo calmo' : 'Modo aventura';

  const choose = (nextMode: LearningMode) => {
    onChange(nextMode);
    if (pickerRef.current) pickerRef.current.open = false;
  };

  return (
    <details className="learning-mode-picker" ref={pickerRef}>
      <summary aria-label={`Ritmo atual: ${currentLabel}. Escolher modo de estudo`}>
        {mode === 'calm' ? (
          <BookOpen size={16} aria-hidden="true" />
        ) : (
          <Sparkles size={16} aria-hidden="true" />
        )}
        <span>{mode === 'calm' ? 'Calmo' : 'Aventura'}</span>
        <ChevronDown className="learning-mode-chevron" size={14} aria-hidden="true" />
      </summary>
      <div className="learning-mode-options" role="group" aria-label="Escolha como quer aprender">
        <button type="button" aria-pressed={mode === 'calm'} onClick={() => choose('calm')}>
          <span className="learning-mode-option-icon">
            <BookOpen size={17} aria-hidden="true" />
          </span>
          <span>
            <b>Estudo calmo</b>
            <small>Leituras no seu ritmo, sem pressão.</small>
          </span>
        </button>
        <button
          type="button"
          aria-pressed={mode === 'adventure'}
          onClick={() => choose('adventure')}
        >
          <span className="learning-mode-option-icon">
            <Gamepad2 size={17} aria-hidden="true" />
          </span>
          <span>
            <b>Modo aventura</b>
            <small>Fases, desafios e progresso.</small>
          </span>
        </button>
      </div>
    </details>
  );
}
