import { useEffect, useState } from 'react';
import {
  ArrowDown,
  ArrowRight,
  Bookmark,
  ChevronDown,
  Clock3,
  FlaskConical,
  History,
  Lightbulb,
  Search,
  ShieldCheck,
  Shuffle,
  Sparkles,
} from 'lucide-react';
import type { Topic } from '@calmandstudy/content';
import { TopicArtwork } from '../topics/TopicArtwork';
import { ContentLikeButton } from '../engagement/ContentLikeButton';
import { areaToneStyle } from '../shared/areaTone';
import type { EngagementItem } from '../engagement/types';
import { ReadStatusButton } from '../reader/ReadStatusButton';
import type { LearningMode } from '../preferences/learning-mode';
import { DeepDivePrompt } from './DeepDivePrompt';

type DiscoveryScreenProps = {
  mode?: LearningMode;
  topics: Topic[];
  matchingTopics: Topic[];
  fields: string[];
  matchingFields: string[];
  field: string;
  query: string;
  fieldQuery: string;
  showFilters: boolean;
  saved: string[];
  readIds: string[];
  onFieldChange: (field: string) => void;
  onQueryChange: (query: string) => void;
  onSearchSubmit: () => void;
  onFieldQueryChange: (query: string) => void;
  onToggleFilters: () => void;
  onToggleSaved: (id: string) => void;
  onToggleRead: (id: string) => void;
  onSelectTopic: (topic: Topic) => void;
  onRandom: () => void;
  onSuggestTopic: () => void;
  onExplorePaths: () => void;
  countInField: (field: string) => number;
  engagementAvailable: boolean;
  getEngagement: (id: string) => EngagementItem;
  onToggleLike: (id: string) => void;
  latestUpdate?: [string, string];
  onViewUpdates?: () => void;
};

const fieldIcons = [History, FlaskConical, Sparkles, Lightbulb];
const topicsPerPage = 6;

export function DiscoveryScreen({
  mode = 'calm',
  topics,
  matchingTopics,
  fields,
  matchingFields,
  field,
  query,
  fieldQuery,
  showFilters,
  saved,
  readIds,
  onFieldChange,
  onQueryChange,
  onSearchSubmit,
  onFieldQueryChange,
  onToggleFilters,
  onToggleSaved,
  onToggleRead,
  onSelectTopic,
  onRandom,
  onSuggestTopic,
  onExplorePaths,
  countInField,
  engagementAvailable,
  getEngagement,
  onToggleLike,
  latestUpdate,
  onViewUpdates = () => {},
}: DiscoveryScreenProps) {
  const adventure = mode === 'adventure';
  const [visibleCount, setVisibleCount] = useState(topicsPerPage);
  useEffect(() => setVisibleCount(topicsPerPage), [field, query]);
  const hasSearchQuery = query.trim().length > 0;
  const visibleTopics = matchingTopics.slice(0, visibleCount);
  const remainingTopics = matchingTopics.length - visibleTopics.length;
  const featuredFields = fields.slice(0, 5);
  if (field !== 'Todas' && !featuredFields.includes(field))
    featuredFields[featuredFields.length - 1] = field;

  return (
    <>
      <section className={`welcome discovery-welcome ${adventure ? 'welcome-adventure' : ''}`}>
        <div className="welcome-visuals" aria-hidden="true">
          <div className="welcome-photo welcome-photo-sage" />
          <div className="welcome-photo welcome-photo-lavender" />
          <div className="welcome-photo welcome-photo-ocean" />
          <div className="welcome-photo welcome-photo-peach" />
          <div className="welcome-photo welcome-photo-paper" />
          <div className="welcome-photo welcome-photo-night" />
          <div className="welcome-photo welcome-photo-contrast" />
        </div>
        <div className="eyebrow">
          <span className="pulse" />
          {adventure ? 'EXPEDIÇÃO EM ANDAMENTO' : 'UM ESPAÇO PARA PAUSAR E APRENDER'}
        </div>
        <h1>
          {adventure ? (
            <>
              Aprender em
              <br />
              <em>modo missão!</em>
            </>
          ) : (
            <>
              Um lugar calmo
              <br />
              para <em>aprender.</em>
            </>
          )}
        </h1>
        <p>
          {adventure
            ? 'Transforme o estudo em missões, conecte ideias e avance no seu ritmo. Qual será sua próxima fase?'
            : 'Encontre um ritmo tranquilo, escolha uma leitura e dê espaço para uma ideia de cada vez.'}
        </p>
        <div className="welcome-actions">
          <button className="primary" onClick={onRandom}>
            <Shuffle size={16} aria-hidden="true" />
            {adventure ? 'Sortear uma missão' : 'Sortear um assunto'}{' '}
            <ArrowRight size={16} aria-hidden="true" />
          </button>
          <span className="soft-note">
            <Sparkles size={14} /> Uma etapa de cada vez, no seu ritmo.
          </span>
        </div>
        <aside className="brazil-origin" aria-label="Origem brasileira do projeto">
          <span className="brazil-origin-mark" aria-hidden="true">
            <svg viewBox="0 0 60 42" role="presentation" focusable="false">
              <rect width="60" height="42" fill="#009739" />
              <path d="M30 4 55 21 30 38 5 21Z" fill="#ffdf00" />
              <circle cx="30" cy="21" r="10.2" fill="#002776" />
              <path
                d="M20 18.4c6.4-1.2 13.2-.6 19.7 1.8"
                fill="none"
                stroke="#fff"
                strokeWidth="1.35"
              />
              <g fill="#fff">
                <circle cx="22.2" cy="16.8" r=".48" />
                <circle cx="24.6" cy="14.7" r=".42" />
                <circle cx="26.7" cy="18" r=".46" />
                <circle cx="27.9" cy="14.2" r=".42" />
                <circle cx="29.1" cy="17.2" r=".46" />
                <circle cx="31.3" cy="14.4" r=".42" />
                <circle cx="32.6" cy="17.1" r=".46" />
                <circle cx="35.5" cy="16.2" r=".4" />
                <circle cx="37.2" cy="18.5" r=".4" />
                <circle cx="24.1" cy="19.4" r=".42" />
                <circle cx="25.8" cy="22" r=".42" />
                <circle cx="28.1" cy="20.1" r=".46" />
                <circle cx="30.2" cy="19.1" r=".42" />
                <circle cx="32.3" cy="21.1" r=".46" />
                <circle cx="34.8" cy="20.2" r=".4" />
                <circle cx="36.2" cy="22.7" r=".4" />
                <circle cx="23.3" cy="23.1" r=".4" />
                <circle cx="26.2" cy="25.3" r=".42" />
                <circle cx="28.6" cy="23.4" r=".46" />
                <circle cx="30.4" cy="25.6" r=".42" />
                <circle cx="33.1" cy="24.1" r=".46" />
                <circle cx="35.4" cy="25.1" r=".4" />
                <circle cx="25" cy="27.1" r=".38" />
                <circle cx="27.4" cy="28.2" r=".38" />
                <circle cx="31.9" cy="27.7" r=".4" />
                <circle cx="34.3" cy="27.3" r=".38" />
                <circle cx="29.4" cy="29.2" r=".34" />
              </g>
            </svg>
          </span>
          <span>
            <b>Projeto brasileiro, fontes do mundo todo</b>
            <small>
              Criada e desenvolvida por{' '}
              <a href="https://edststechhub.pages.dev/" target="_blank" rel="noopener noreferrer">
                Ednaldo Nicolau dos Santos
              </a>{' '}
              com referências pesquisadas em fontes públicas de diferentes países.
            </small>
          </span>
        </aside>
        {latestUpdate && (
          <aside className="welcome-update" aria-label="Novidade recente do Estude com Calma">
            <span className="welcome-update-icon">
              <Sparkles size={17} aria-hidden="true" />
            </span>
            <div className="welcome-update-copy">
              <span>Novidade recente</span>
              <strong>{latestUpdate[0]}</strong>
            </div>
            <button type="button" onClick={onViewUpdates}>
              Ver novidades <ArrowRight size={15} aria-hidden="true" />
            </button>
          </aside>
        )}
      </section>

      <section className="content-area">
        <div className="section-heading">
          <div>
            <div className="eyebrow muted">UM BOM LUGAR PRA COMEÇAR</div>
            <h2>
              O que você quer estudar<span>?</span>
            </h2>
          </div>
          <button
            className={`area-toggle ${showFilters ? 'is-open' : ''}`}
            aria-expanded={showFilters}
            aria-controls="science-filters"
            onClick={onToggleFilters}
          >
            <span>
              {showFilters ? (
                'Ocultar áreas'
              ) : (
                <>
                  Explorar áreas <small>{fields.length - 1}</small>
                </>
              )}
            </span>
            <ChevronDown size={17} aria-hidden="true" />
          </button>
        </div>

        <div id="science-filters" className={`filters ${showFilters ? 'expanded-filters' : ''}`}>
          <label className="search-box" htmlFor="search">
            <Search size={17} aria-hidden="true" />
            <span className="visually-hidden">Buscar assunto</span>
            <input
              id="search"
              maxLength={160}
              placeholder="O que você quer aprender?"
              value={query}
              onChange={event => {
                const value = event.target.value;
                onQueryChange(value);
                if (value.trim()) onSearchSubmit();
              }}
            />
          </label>
          {showFilters ? (
            <section className="field-picker" aria-labelledby="field-picker-title">
              <div className="field-picker-heading">
                <div>
                  <h3 id="field-picker-title">Explore por ciência</h3>
                  <p>Escolha entre {fields.length - 1} áreas ou pesquise pelo nome.</p>
                </div>
                <label className="field-search" htmlFor="field-search">
                  <Search size={16} aria-hidden="true" />
                  <span className="visually-hidden">Buscar ciência</span>
                  <input
                    id="field-search"
                    maxLength={80}
                    placeholder="Ex.: Astronomia, Biologia…"
                    value={fieldQuery}
                    onChange={event => onFieldQueryChange(event.target.value)}
                  />
                  <span className="field-search-count">
                    {matchingFields.filter(item => item !== 'Todas').length}
                  </span>
                </label>
              </div>
              <div className="field-picker-list" role="group" aria-label="Filtrar por ciência">
                {matchingFields.map(item => (
                  <button
                    className={`field-option ${field === item ? 'chosen' : ''}`}
                    key={item}
                    aria-pressed={field === item}
                    onClick={() => onFieldChange(item)}
                  >
                    <span>{item}</span>
                    <small>
                      {item === 'Todas'
                        ? `${topics.length} artigos`
                        : `${countInField(item)} ${countInField(item) === 1 ? 'artigo' : 'artigos'}`}
                    </small>
                  </button>
                ))}
                {matchingFields.length === 0 && (
                  <p className="field-empty">Nenhuma área encontrada. Tente outro nome.</p>
                )}
              </div>
            </section>
          ) : (
            <div className="chips" role="group" aria-label="Ciências em destaque">
              {featuredFields.map(item => (
                <button
                  className={`chip ${field === item ? 'chosen' : ''}`}
                  key={item}
                  aria-pressed={field === item}
                  onClick={() => onFieldChange(item)}
                >
                  <span>{item}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="feed-status" role="status" aria-live="polite" aria-atomic="true">
          <span className="feed-status-dot" aria-hidden="true" />
          {field === 'Todas' ? 'Todas as ciências' : field}
          <span aria-hidden="true">·</span>
          {matchingTopics.length} {matchingTopics.length === 1 ? 'artigo' : 'artigos'}
        </div>
        <div className="discovery-grid">
          {visibleTopics.map((topic, index) => {
            const Icon = fieldIcons[index % fieldIcons.length];
            const isSaved = saved.includes(topic.id);
            return (
              <article
                className={`topic-card card-${index % 3}`}
                key={topic.id}
                style={areaToneStyle(topic.field)}
              >
                <div className="card-top">
                  <span className="field-tag">
                    <Icon size={13} aria-hidden="true" />
                    {topic.field}
                  </span>
                  <button
                    className={`bookmark-btn ${isSaved ? 'is-saved' : ''}`}
                    aria-label={
                      isSaved ? `Remover ${topic.title} dos salvos` : `Salvar ${topic.title}`
                    }
                    aria-pressed={isSaved}
                    onClick={() => onToggleSaved(topic.id)}
                  >
                    <Bookmark
                      size={17}
                      fill={isSaved ? 'currentColor' : 'none'}
                      aria-hidden="true"
                    />
                  </button>
                </div>
                <TopicArtwork topic={topic} mode="card" />
                <div className="card-content">
                  <span className="topic-meta">
                    {topic.period}
                    <span>·</span>
                    <Clock3 size={12} />
                    {topic.readingTime} min de leitura
                  </span>
                  <h3>
                    <button className="topic-title-link" onClick={() => onSelectTopic(topic)}>
                      {topic.title}
                    </button>
                  </h3>
                  <p>{topic.summary}</p>
                  <button className="read-more" onClick={() => onSelectTopic(topic)}>
                    Descobrir: {topic.title} <ArrowRight size={15} aria-hidden="true" />
                  </button>
                </div>
                <div className="card-foot">
                  <span className="trust-mini">
                    <ShieldCheck size={14} aria-hidden="true" />
                    {topic.editorial?.status === 'published' && topic.editorial.assessment
                      ? `Índice editorial: ${topic.editorial.assessment.score}%`
                      : 'Verificação editorial pendente'}
                  </span>
                  <span className="source-mini">
                    {topic.editorial?.status === 'published'
                      ? `${topic.editorial.sources.length} fontes verificadas`
                      : 'Fontes ainda não auditadas'}
                  </span>
                  <div className="card-actions">
                    <ReadStatusButton
                      read={readIds.includes(topic.id)}
                      compact
                      onToggle={() => onToggleRead(topic.id)}
                    />
                    <ContentLikeButton
                      item={getEngagement(topic.id)}
                      disabled={!engagementAvailable}
                      onClick={() => onToggleLike(topic.id)}
                    />
                  </div>
                </div>
              </article>
            );
          })}
          {matchingTopics.length === 0 && (
            <div className="no-results">
              <span className="empty-spark">
                <Sparkles size={20} />
              </span>
              <h3>
                {hasSearchQuery ? 'Nenhum assunto encontrado' : 'Estamos preparando esta área'}
              </h3>
              <p>
                {hasSearchQuery
                  ? 'Tente outra busca ou envie sua ideia para a fila de revisão editorial.'
                  : `Estamos reunindo fontes confiáveis para ${field}. Enquanto isso, explore outra ciência ou descubra um tema aleatório.`}
              </p>
              {hasSearchQuery && (
                <button className="outline-btn" onClick={onSuggestTopic}>
                  <Lightbulb size={15} aria-hidden="true" /> Sugerir “{query.trim()}”{' '}
                  <ArrowRight size={14} aria-hidden="true" />
                </button>
              )}
              {!hasSearchQuery && (
                <button className="outline-btn" onClick={() => onFieldChange('Todas')}>
                  Ver assuntos disponíveis <ArrowRight size={14} />
                </button>
              )}
            </div>
          )}
        </div>
        {matchingTopics.length > topicsPerPage && (
          <div className="discovery-pagination" aria-live="polite">
            <span>
              Exibindo {visibleTopics.length} de {matchingTopics.length} assuntos
            </span>
            {remainingTopics > 0 && (
              <button
                className="outline-btn"
                onClick={() => setVisibleCount(count => count + topicsPerPage)}
              >
                Mostrar mais assuntos <small>+{Math.min(topicsPerPage, remainingTopics)}</small>
                <ArrowDown size={15} aria-hidden="true" />
              </button>
            )}
          </div>
        )}

        <DeepDivePrompt onExplore={onExplorePaths} />
      </section>
    </>
  );
}
