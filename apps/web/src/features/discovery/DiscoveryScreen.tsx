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

type DiscoveryScreenProps = {
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
      <section className="welcome">
        <div className="welcome-visuals" aria-hidden="true">
          <div className="welcome-photo welcome-photo-sage" />
          <div className="welcome-photo welcome-photo-lavender" />
          <div className="welcome-photo welcome-photo-ocean" />
          <div className="welcome-photo welcome-photo-peach" />
          <div className="welcome-photo welcome-photo-night" />
        </div>
        <div className="eyebrow">
          <span className="pulse" /> UMA PERGUNTA PRA HOJE
        </div>
        <h1>
          O mundo é maior
          <br />
          que a nossa <em>rotina.</em>
        </h1>
        <p>
          Escolha um assunto que ficou na sua cabeça —<br className="desktop-break" /> ou deixe a
          curiosidade escolher por você.
        </p>
        <div className="welcome-actions">
          <button className="primary" onClick={onRandom}>
            <Shuffle size={16} aria-hidden="true" /> Sortear um assunto{' '}
            <ArrowRight size={16} aria-hidden="true" />
          </button>
          <span className="soft-note">
            <Sparkles size={14} /> Sem ordem obrigatória. Só curiosidade.
          </span>
        </div>
        {latestUpdate && (
          <aside className="welcome-update" aria-label="Novidade recente da Calm & Study">
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
              O que você quer descobrir<span>?</span>
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
              placeholder="Que assunto desperta sua curiosidade?"
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

        <div className="deep-dive">
          <div className="deep-icon">
            <Sparkles size={20} />
          </div>
          <div>
            <span className="eyebrow muted">APRENDA NO SEU RITMO</span>
            <h3>Quer se aprofundar em um tema?</h3>
            <p>Escolha uma área e monte uma trilha clara, do começo ao próximo nível.</p>
          </div>
          <button className="outline-btn" onClick={onExplorePaths}>
            Explorar trilhas <ArrowRight size={15} />
          </button>
        </div>
      </section>
    </>
  );
}
