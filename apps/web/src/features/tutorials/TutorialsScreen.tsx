import { useId, useMemo, useState } from 'react';
import { ArrowRight, Check, FilterX, GraduationCap, Search, Shuffle, X } from 'lucide-react';
import type { Tutorial } from '@calmandstudy/content';
import { TutorialArtwork } from './TutorialArtwork';
import { ContentLikeButton } from '../engagement/ContentLikeButton';
import { areaToneStyle } from '../shared/areaTone';
import type { EngagementItem } from '../engagement/types';
import type { LearningMode } from '../preferences/learning-mode';

type TutorialsScreenProps = {
  mode: LearningMode;
  tutorials: Tutorial[];
  completedIds: string[];
  onRandom: () => void;
  onOpen: (tutorial: Tutorial) => void;
  engagementAvailable: boolean;
  getEngagement: (id: string) => EngagementItem;
  onToggleLike: (id: string) => void;
};

export function TutorialsScreen({
  mode,
  tutorials,
  completedIds,
  onRandom,
  onOpen,
  engagementAvailable,
  getEngagement,
  onToggleLike,
}: TutorialsScreenProps) {
  const adventure = mode === 'adventure';
  const searchId = useId();
  const areaId = useId();
  const [query, setQuery] = useState('');
  const [area, setArea] = useState('');
  const areas = useMemo(
    () =>
      [...new Set(tutorials.map(tutorial => tutorial.field))].sort((a, b) =>
        a.localeCompare(b, 'pt-BR'),
      ),
    [tutorials],
  );
  const finishedCount = tutorials.filter(tutorial => completedIds.includes(tutorial.id)).length;
  const visibleTutorials = useMemo(() => {
    const term = query.trim().toLocaleLowerCase('pt-BR');
    return tutorials.filter(tutorial => {
      if (area && tutorial.field !== area) return false;
      return (
        !term ||
        `${tutorial.title} ${tutorial.description} ${tutorial.field} ${tutorial.materials.join(' ')} ${tutorial.steps.map(step => `${step.title} ${step.instruction}`).join(' ')}`
          .toLocaleLowerCase('pt-BR')
          .includes(term)
      );
    });
  }, [area, query, tutorials]);
  const clearFilters = () => {
    setQuery('');
    setArea('');
  };

  return (
    <>
      <section className={`welcome compact ${adventure ? 'welcome-adventure' : ''}`}>
        <div className="eyebrow">
          <GraduationCap size={14} aria-hidden="true" />
          {adventure ? 'DESAFIOS PRÁTICOS' : 'APRENDA FAZENDO'}
        </div>
        <h1>
          {adventure ? (
            <>
              Missões curtas,
              <br />
              <em>ideias em ação.</em>
            </>
          ) : (
            <>
              Um passo a passo,
              <br />
              <em>uma nova ideia.</em>
            </>
          )}
        </h1>
        <p>
          {adventure
            ? `Você concluiu ${finishedCount} de ${tutorials.length} missões. Pratique por etapas, consulte as fontes e retome quando quiser.`
            : `Você concluiu ${finishedCount} de ${tutorials.length} tutoriais. Pratique em etapas, consulte as fontes e retome qualquer atividade quando quiser.`}
        </p>
        <div className="welcome-actions">
          <button className="primary" onClick={onRandom}>
            <Shuffle size={15} aria-hidden="true" />
            {adventure ? 'Sortear uma missão' : 'Tutorial aleatório'}{' '}
            <ArrowRight size={15} aria-hidden="true" />
          </button>
        </div>
      </section>
      <section
        className="trail-filter-panel tutorial-filter-panel"
        role="search"
        aria-label="Buscar tutoriais"
      >
        <label htmlFor={searchId}>
          <span>Encontre um tutorial</span>
          <span className="trail-filter-search">
            <Search size={16} aria-hidden="true" />
            <input
              id={searchId}
              type="search"
              maxLength={160}
              value={query}
              onChange={event => setQuery(event.target.value)}
              placeholder="Busque por título, tema ou palavra"
            />
          </span>
        </label>
        <label htmlFor={areaId}>
          <span>Área científica</span>
          <select id={areaId} value={area} onChange={event => setArea(event.target.value)}>
            <option value="">Todas as áreas</option>
            {areas.map(item => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
        <div className="trail-filter-status" role="status" aria-live="polite">
          {visibleTutorials.length} de {tutorials.length} tutoriais · {finishedCount} concluídos
        </div>
        {(query || area) && (
          <button className="trail-filter-clear" onClick={clearFilters}>
            <X size={14} aria-hidden="true" /> Limpar filtros
          </button>
        )}
      </section>
      {visibleTutorials.length > 0 ? (
        <section className="trail-grid tutorial-grid" aria-label="Tutoriais disponíveis">
          {visibleTutorials.map(tutorial => {
            const originalIndex = tutorials.findIndex(item => item.id === tutorial.id);
            const isComplete = completedIds.includes(tutorial.id);
            return (
              <article
                className={`tutorial-card ${isComplete ? 'tutorial-card-complete' : ''}`}
                key={tutorial.id}
                style={areaToneStyle(tutorial.field)}
              >
                <TutorialArtwork tutorial={tutorial} index={originalIndex} />
                <div className="tutorial-card-meta">
                  <div className="trail-meta">{tutorial.field}</div>
                  {isComplete && (
                    <span className="tutorial-completed-badge">
                      <Check size={13} aria-hidden="true" /> Concluído
                    </span>
                  )}
                </div>
                <h3>{tutorial.title}</h3>
                <p>{tutorial.description}</p>
                <div className="tutorial-card-engagement">
                  <ContentLikeButton
                    item={getEngagement(tutorial.id)}
                    disabled={!engagementAvailable}
                    onClick={() => onToggleLike(tutorial.id)}
                  />
                </div>
                <button className="trail-link" onClick={() => onOpen(tutorial)}>
                  {isComplete ? 'Rever tutorial' : 'Começar tutorial'}{' '}
                  <ArrowRight size={15} aria-hidden="true" />
                </button>
              </article>
            );
          })}
        </section>
      ) : (
        <div className="trail-filter-empty">
          <FilterX size={22} aria-hidden="true" />
          <h2>Nenhum tutorial encontrado</h2>
          <p>Tente outro termo ou escolha “Todas as áreas”.</p>
          <button className="outline-btn" onClick={clearFilters}>
            Limpar filtros
          </button>
        </div>
      )}
    </>
  );
}
