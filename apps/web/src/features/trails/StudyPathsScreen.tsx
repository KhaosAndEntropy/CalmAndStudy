import { useId, useMemo, useState } from 'react';
import { ArrowRight, FilterX, History, Search, X } from 'lucide-react';
import type { StudyPath, Topic } from '@calmandstudy/content';
import { buildStudyPathAssessment } from '@calmandstudy/content';
import { TrailArtwork } from './TrailArtwork';
import { ContentLikeButton } from '../engagement/ContentLikeButton';
import type { EngagementItem } from '../engagement/types';
import { KnowledgeAssessment } from '../assessment/KnowledgeAssessment';
import { areaToneStyle } from '../shared/areaTone';
import type { LearningMode } from '../preferences/learning-mode';

type StudyPathsScreenProps = {
  mode?: LearningMode;
  paths: StudyPath[];
  topics: Topic[];
  onSelectTopic: (topic: Topic) => void;
  engagementAvailable: boolean;
  getEngagement: (id: string) => EngagementItem;
  onToggleLike: (id: string) => void;
  onTrackRead: (id: string) => void;
};

export function StudyPathsScreen({
  mode = 'calm',
  paths,
  topics,
  onSelectTopic,
  engagementAvailable,
  getEngagement,
  onToggleLike,
  onTrackRead,
}: StudyPathsScreenProps) {
  const adventure = mode === 'adventure';
  const searchId = useId();
  const areaId = useId();
  const [query, setQuery] = useState('');
  const [area, setArea] = useState('');
  const topicById = useMemo(() => new Map(topics.map(topic => [topic.id, topic])), [topics]);
  const areas = useMemo(
    () => [...new Set(paths.map(path => path.field))].sort((a, b) => a.localeCompare(b, 'pt-BR')),
    [paths],
  );
  const filteredPaths = useMemo(() => {
    const term = query.trim().toLocaleLowerCase('pt-BR');
    return paths.filter(path => {
      if (area && path.field !== area) return false;
      if (!term) return true;
      const linkedTopics = path.topicIds
        .map(id => topicById.get(id))
        .filter((topic): topic is Topic => Boolean(topic));
      const searchableText = [
        path.title,
        path.description,
        path.field,
        ...linkedTopics.flatMap(topic => [topic.title, topic.summary, ...topic.tags]),
      ]
        .join(' ')
        .toLocaleLowerCase('pt-BR');
      return searchableText.includes(term);
    });
  }, [area, paths, query, topicById]);

  const clearFilters = () => {
    setQuery('');
    setArea('');
  };

  return (
    <>
      <section className={`welcome compact ${adventure ? 'welcome-adventure' : ''}`}>
        <div className="eyebrow">
          <History size={14} aria-hidden="true" />
          {adventure ? 'ROTAS DA EXPEDIÇÃO' : 'APRENDER COM CONTEXTO'}
        </div>
        <h1>
          {adventure ? (
            <>
              Cada rota abre
              <br />
              <em>um novo caminho.</em>
            </>
          ) : (
            <>
              Uma ideia leva
              <br />
              <em>a outra.</em>
            </>
          )}
        </h1>
        <p>
          {adventure
            ? 'Escolha uma rota e avance por etapas conectadas. Cada parada continua sendo um artigo que você pode abrir livremente.'
            : 'Sequências sugeridas para construir contexto. Você pode abrir qualquer assunto, em qualquer ordem.'}
        </p>
      </section>
      <div className="trail-coverage" role="status">
        <span className="tiny-icon">
          <History size={16} aria-hidden="true" />
        </span>
        <p>
          <strong>{paths.length} trilhas</strong> conectam{' '}
          <strong>{new Set(paths.flatMap(path => path.topicIds)).size} artigos</strong> do catálogo.
          Cada etapa é uma sugestão: você pode abrir qualquer assunto diretamente.
        </p>
      </div>
      <section className="trail-filter-panel" role="search" aria-label="Buscar trilhas de estudo">
        <label htmlFor={searchId}>
          <span>Encontre uma trilha</span>
          <span className="trail-filter-search">
            <Search size={16} aria-hidden="true" />
            <input
              id={searchId}
              type="search"
              maxLength={160}
              value={query}
              onChange={event => setQuery(event.target.value)}
              placeholder="Busque por título, tema ou assunto"
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
          {filteredPaths.length} de {paths.length} trilhas
        </div>
        {(query || area) && (
          <button className="trail-filter-clear" onClick={clearFilters}>
            <X size={14} aria-hidden="true" /> Limpar filtros
          </button>
        )}
      </section>
      {filteredPaths.length > 0 ? (
        <section className="trail-grid" aria-label="Trilhas de estudo">
          {filteredPaths.map(path => (
            <article className="trail-card" key={path.id} style={areaToneStyle(path.field)}>
              <TrailArtwork path={path} />
              <div className="trail-meta">{path.field}</div>
              <h3>{path.title}</h3>
              <p>{path.description}</p>
              <div className="path-steps">
                {path.topicIds.map((id, index) => {
                  const topic = topicById.get(id);
                  return topic ? (
                    <button
                      key={id}
                      onClick={() => {
                        onTrackRead(path.id);
                        onSelectTopic(topic);
                      }}
                    >
                      <span>{index + 1}</span>
                      {topic.title}
                      <ArrowRight size={13} aria-hidden="true" />
                    </button>
                  ) : null;
                })}
              </div>
              <div className="path-note">{path.connectionNote}</div>
              <div className="trail-card-engagement">
                <ContentLikeButton
                  item={getEngagement(path.id)}
                  disabled={!engagementAvailable}
                  onClick={() => onToggleLike(path.id)}
                />
              </div>
              <details className="path-practice">
                <summary>Praticar os {path.topicIds.length} temas</summary>
                <ol>
                  {path.topicIds.map(id => {
                    const topic = topicById.get(id);
                    return topic ? (
                      <li key={id}>
                        <b>{topic.title}</b>
                        <p>
                          Explique com suas palavras: {topic.fact} Depois, cite uma evidência do
                          artigo que ajude a sustentar essa ideia.
                        </p>
                      </li>
                    ) : null;
                  })}
                </ol>
                <p className="path-practice-synthesis">
                  Para concluir, escreva uma síntese mencionando a ideia central de cada assunto e
                  explique como as etapas se conectam — ou quando são apenas comparações.
                </p>
              </details>
              <KnowledgeAssessment
                assessment={buildStudyPathAssessment(path, topics)}
                collapsible
              />
            </article>
          ))}
        </section>
      ) : (
        <div className="trail-filter-empty">
          <FilterX size={22} aria-hidden="true" />
          <h2>Nenhuma trilha encontrada</h2>
          <p>Tente outro termo ou escolha “Todas as áreas”.</p>
          <button className="outline-btn" onClick={clearFilters}>
            Limpar filtros
          </button>
        </div>
      )}
    </>
  );
}
