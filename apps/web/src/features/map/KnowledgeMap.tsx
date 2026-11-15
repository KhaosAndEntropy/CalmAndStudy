import { useMemo, useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  GitBranch,
  ListOrdered,
  Network,
  Search,
  Sparkles,
  Trees,
} from 'lucide-react';
import { studyPaths, suggestedNextTopicIds, type Topic } from '@calmandstudy/content';

type KnowledgeMapProps = {
  topics: Topic[];
  onOpenTopic: (topic: Topic) => void;
  mode?: 'calm' | 'adventure';
};

type MapEdge = { from: string; to: string; kind: 'trilha' | 'tema relacionado' };

function buildEdges(topics: Topic[]): MapEdge[] {
  const ids = new Set(topics.map(topic => topic.id));
  const edges = new Map<string, MapEdge>();
  const add = (from: string, to: string, kind: MapEdge['kind']) => {
    if (from === to || !ids.has(from) || !ids.has(to)) return;
    const key = [from, to].sort().join(':');
    const previous = edges.get(key);
    if (!previous || kind === 'trilha') edges.set(key, { from, to, kind });
  };

  topics.forEach(topic => {
    topic.relatedTopics?.forEach(id => add(topic.id, id, 'tema relacionado'));
    suggestedNextTopicIds[topic.id]?.forEach(id => add(topic.id, id, 'trilha'));
  });
  studyPaths.forEach(path => {
    path.topicIds.forEach((id, index) => {
      if (index < path.topicIds.length - 1) add(id, path.topicIds[index + 1], 'trilha');
    });
  });
  return [...edges.values()];
}

export function KnowledgeMap({ topics, onOpenTopic, mode = 'calm' }: KnowledgeMapProps) {
  const adventure = mode === 'adventure';
  const [query, setQuery] = useState('');
  const [area, setArea] = useState('Todas');
  const [selectedId, setSelectedId] = useState('');
  const [view, setView] = useState<'sequence' | 'tree' | 'graph'>('sequence');
  const areas = useMemo(
    () =>
      [...new Set(topics.map(topic => topic.field))].sort((a, b) => a.localeCompare(b, 'pt-BR')),
    [topics],
  );
  const visibleTopics = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase('pt-BR');
    return topics.filter(topic => {
      const matchesArea = area === 'Todas' || topic.field === area;
      const matchesQuery =
        !normalizedQuery ||
        `${topic.title} ${topic.field} ${topic.summary}`
          .toLocaleLowerCase('pt-BR')
          .includes(normalizedQuery);
      return matchesArea && matchesQuery;
    });
  }, [area, query, topics]);
  const edges = useMemo(() => buildEdges(visibleTopics), [visibleTopics]);
  const selected = visibleTopics.find(topic => topic.id === selectedId) ?? visibleTopics[0] ?? null;
  const related = selected
    ? edges.filter(
        edge =>
          edge.kind === 'tema relacionado' &&
          (edge.from === selected.id || edge.to === selected.id),
      )
    : [];
  const previous = selected
    ? edges.filter(edge => edge.kind === 'trilha' && edge.to === selected.id)
    : [];
  const next = selected
    ? edges.filter(edge => edge.kind === 'trilha' && edge.from === selected.id)
    : [];
  const byId = new Map(visibleTopics.map(topic => [topic.id, topic]));

  function renderConnections(connections: MapEdge[], current: Topic) {
    if (connections.length === 0)
      return (
        <p className="knowledge-map-unconnected">Nenhum vínculo editorial cadastrado ainda.</p>
      );
    return connections.map(edge => {
      const otherId = edge.from === current.id ? edge.to : edge.from;
      const other = byId.get(otherId);
      if (!other) return null;
      return (
        <button
          className="knowledge-map-topic-link map-hover-card"
          key={`${edge.from}-${edge.to}`}
          type="button"
          onClick={() => setSelectedId(other.id)}
        >
          <span className="knowledge-map-topic-index" aria-hidden="true">
            <GitBranch size={15} />
          </span>
          <span className="knowledge-map-topic-copy">
            <b>{other.title}</b>
            <small>{other.field}</small>
          </span>
          <ArrowRight size={17} aria-hidden="true" />
        </button>
      );
    });
  }

  return (
    <section className="knowledge-map-page" aria-labelledby="knowledge-map-title">
      <header className="knowledge-map-heading">
        <div className="eyebrow">
          <Network size={15} aria-hidden="true" />{' '}
          {adventure ? 'MAPA DA EXPEDIÇÃO' : 'MAPA DE ASSUNTOS'}
        </div>
        <h1 id="knowledge-map-title">
          {adventure
            ? 'Trace seu próximo caminho de descoberta.'
            : 'Veja como as ideias se encontram.'}
        </h1>
        <p>
          {adventure
            ? 'Escolha um ponto de partida e siga a rota. A árvore e o grafo mostram outros caminhos para explorar, sem perder seu lugar.'
            : 'Escolha um assunto para descobrir o que pode ajudar antes, qual é o próximo passo e quais temas conversam com ele.'}
        </p>
      </header>

      <div className="knowledge-map-filters">
        <label className="knowledge-map-search">
          <Search size={17} aria-hidden="true" />
          <span className="visually-hidden">Buscar assunto no mapa</span>
          <input
            value={query}
            onChange={event => setQuery(event.target.value)}
            placeholder="Buscar um assunto…"
          />
        </label>
        <label className="knowledge-map-area">
          <span>Área</span>
          <select value={area} onChange={event => setArea(event.target.value)}>
            <option value="Todas">Todas as áreas</option>
            {areas.map(value => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </label>
        <label className="knowledge-map-topic-select">
          <span>Assunto</span>
          <select
            aria-label="Assunto selecionado"
            value={selected?.id ?? ''}
            onChange={event => setSelectedId(event.target.value)}
          >
            {visibleTopics.map(topic => (
              <option key={topic.id} value={topic.id}>
                {topic.title}
              </option>
            ))}
          </select>
        </label>
        <span className="knowledge-map-count">
          {visibleTopics.length} {visibleTopics.length === 1 ? 'assunto' : 'assuntos'} ·{' '}
          {edges.length} {edges.length === 1 ? 'conexão' : 'conexões'}
        </span>
      </div>

      <div className="knowledge-map-view-control">
        <div>
          <b>
            {adventure ? 'Escolha como explorar a expedição' : 'Escolha como explorar as conexões'}
          </b>
          <span>
            {adventure
              ? 'Siga uma rota, abra ramificações ou veja a constelação completa de assuntos.'
              : 'Veja uma sequência de leitura, uma árvore de relações ou o grafo completo.'}
          </span>
        </div>
        <div className="knowledge-map-view-options" role="group" aria-label="Formato das conexões">
          <button
            type="button"
            className="knowledge-map-graph-toggle"
            aria-pressed={view === 'sequence'}
            onClick={() => setView('sequence')}
          >
            <ListOrdered size={17} aria-hidden="true" /> Sequência
          </button>
          <button
            type="button"
            className="knowledge-map-graph-toggle"
            aria-pressed={view === 'tree'}
            onClick={() => setView('tree')}
          >
            <Trees size={17} aria-hidden="true" /> Árvore
          </button>
          <button
            type="button"
            className="knowledge-map-graph-toggle"
            aria-pressed={view === 'graph'}
            aria-controls="knowledge-map-network"
            onClick={() => setView('graph')}
          >
            <Network size={17} aria-hidden="true" /> Grafo
          </button>
        </div>
      </div>

      {view === 'graph' && selected && (
        <section
          className="knowledge-network"
          id="knowledge-map-network"
          aria-label="Grafo de assuntos"
        >
          <div className="knowledge-network-heading">
            <div>
              <h2>Uma visão de toda a rede</h2>
              <p>
                Cada cartão é um artigo. Selecione um para ver a sequência e as relações abaixo.
              </p>
            </div>
            <span>
              {visibleTopics.length} assuntos · {edges.length} conexões
            </span>
          </div>
          <div
            className="knowledge-network-scroll"
            role="region"
            tabIndex={0}
            aria-label="Grafo; em telas estreitas, deslize para os lados"
          >
            <div
              className="knowledge-network-canvas"
              style={{
                height: `${Math.max(850, 86 + Math.ceil(visibleTopics.length / 8) * 82)}px`,
              }}
            >
              <svg
                className="knowledge-network-edges"
                viewBox={`0 0 1400 ${Math.max(850, 86 + Math.ceil(visibleTopics.length / 8) * 82)}`}
                aria-hidden="true"
              >
                {edges.map(edge => {
                  const fromIndex = visibleTopics.findIndex(topic => topic.id === edge.from);
                  const toIndex = visibleTopics.findIndex(topic => topic.id === edge.to);
                  if (fromIndex < 0 || toIndex < 0) return null;
                  const fromX = 88 + (fromIndex % 8) * 174;
                  const fromY = 44 + Math.floor(fromIndex / 8) * 82;
                  const toX = 88 + (toIndex % 8) * 174;
                  const toY = 44 + Math.floor(toIndex / 8) * 82;
                  const focused = edge.from === selected.id || edge.to === selected.id;
                  return (
                    <line
                      key={`${edge.from}-${edge.to}`}
                      x1={fromX}
                      y1={fromY}
                      x2={toX}
                      y2={toY}
                      className={`knowledge-network-edge ${edge.kind === 'trilha' ? 'is-sequence' : 'is-related'} ${focused ? 'is-focused' : ''}`}
                    />
                  );
                })}
              </svg>
              {visibleTopics.map((topic, index) => {
                const isSelected = topic.id === selected.id;
                const isConnected = edges.some(
                  edge =>
                    (edge.from === selected.id && edge.to === topic.id) ||
                    (edge.to === selected.id && edge.from === topic.id),
                );
                return (
                  <button
                    type="button"
                    key={topic.id}
                    className={`knowledge-network-node ${isSelected ? 'is-selected' : ''} ${isConnected ? 'is-connected' : ''}`}
                    style={{
                      left: `${88 + (index % 8) * 174}px`,
                      top: `${44 + Math.floor(index / 8) * 82}px`,
                    }}
                    aria-label={`${topic.title}, ${topic.field}`}
                    aria-pressed={isSelected}
                    title={`${topic.title} · ${topic.field}`}
                    onClick={() => setSelectedId(topic.id)}
                  >
                    <span>{topic.title}</span>
                    <small>{topic.field}</small>
                  </button>
                );
              })}
            </div>
          </div>
          <div className="knowledge-network-legend" aria-label="Legenda das conexões">
            <span>
              <i className="is-sequence" /> Sequência sugerida
            </span>
            <span>
              <i className="is-related" /> Tema relacionado
            </span>
            <small>As relações são sugestões editoriais, não indicam causa e efeito.</small>
          </div>
        </section>
      )}

      {view === 'tree' && selected && (
        <section className="knowledge-map-structure" aria-label="Árvore de relações do assunto">
          <header>
            <Trees size={20} aria-hidden="true" />
            <div>
              <h2>Árvore de relações editoriais</h2>
              <p>
                O assunto escolhido no centro; as conexões ficam agrupadas pelo tipo de relação.
              </p>
            </div>
          </header>
          <button
            className="knowledge-map-tree-root map-hover-card"
            type="button"
            onClick={() => onOpenTopic(selected)}
          >
            <small>{selected.field} · assunto atual</small>
            <b>{selected.title}</b>
            <span>
              Ler artigo <ArrowRight size={15} aria-hidden="true" />
            </span>
          </button>
          <div className="knowledge-map-tree-branches">
            {[
              {
                title: 'Bases sugeridas',
                icon: <BookOpen size={16} aria-hidden="true" />,
                items: previous,
              },
              {
                title: 'Próximos passos',
                icon: <ArrowRight size={16} aria-hidden="true" />,
                items: next,
              },
              {
                title: 'Temas relacionados',
                icon: <Sparkles size={16} aria-hidden="true" />,
                items: related,
              },
            ].map(branch => (
              <section className="knowledge-map-tree-branch" key={branch.title}>
                <h3>
                  {branch.icon}
                  {branch.title}
                </h3>
                {branch.items.length ? (
                  renderConnections(branch.items, selected)
                ) : (
                  <p className="knowledge-map-unconnected">Nenhum assunto nesta relação ainda.</p>
                )}
              </section>
            ))}
          </div>
          <p className="knowledge-map-note">
            As ligações são sugestões editoriais de navegação; assuntos relacionados não são
            necessariamente pré-requisitos.
          </p>
        </section>
      )}

      {view === 'sequence' && selected ? (
        <div
          className="knowledge-map-visual"
          aria-label="Caminho de aprendizagem e temas relacionados"
        >
          <div className="knowledge-map-path" aria-label="Sequência de aprendizagem">
            {[
              {
                id: 'before',
                label: 'Para entender antes',
                hint: 'Uma base útil para este tema',
                topic: previous.length
                  ? byId.get(previous[0].from === selected.id ? previous[0].to : previous[0].from)
                  : null,
              },
              {
                id: 'current',
                label: 'Você está aqui',
                hint: selected.field,
                topic: selected,
              },
              {
                id: 'after',
                label: 'Próximo passo',
                hint: 'Continue a sequência',
                topic: next.length
                  ? byId.get(next[0].from === selected.id ? next[0].to : next[0].from)
                  : null,
              },
            ].map(step => (
              <div
                className={`knowledge-map-step ${step.id === 'current' ? 'is-current' : ''}`}
                key={step.id}
              >
                <h2 className="knowledge-map-step-label">{step.label}</h2>
                {step.topic ? (
                  <button
                    className="knowledge-map-step-card map-hover-card"
                    type="button"
                    aria-label={
                      step.id === 'current'
                        ? `Ler artigo: ${selected.title}`
                        : `Selecionar assunto: ${step.topic.title}`
                    }
                    onClick={() =>
                      step.id === 'current' ? onOpenTopic(selected) : setSelectedId(step.topic!.id)
                    }
                  >
                    <small>{step.hint}</small>
                    <b>{step.topic.title}</b>
                    {step.id === 'current' && <span>{selected.summary}</span>}
                    {step.id === 'current' && (
                      <span className="knowledge-map-read">
                        <BookOpen size={15} aria-hidden="true" /> Ler artigo{' '}
                        <ArrowRight size={14} aria-hidden="true" />
                      </span>
                    )}
                  </button>
                ) : (
                  <div className="knowledge-map-step-empty">
                    <b>{step.id === 'before' ? 'Início da sequência' : 'Fim da sequência'}</b>
                    <span>
                      {step.id === 'before'
                        ? 'Nenhuma leitura anterior cadastrada.'
                        : 'Ainda não há próximo tema cadastrado.'}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
          {previous.length > 1 && (
            <div className="knowledge-map-extra">
              <b>Outras bases sugeridas</b>
              {renderConnections(previous.slice(1), selected)}
            </div>
          )}
          {next.length > 1 && (
            <div className="knowledge-map-extra">
              <b>Mais próximos passos</b>
              {renderConnections(next.slice(1), selected)}
            </div>
          )}
          <section className="knowledge-map-related" aria-labelledby="map-related">
            <div className="knowledge-map-related-heading">
              <Sparkles size={18} aria-hidden="true" />
              <div>
                <h3 id="map-related">Assuntos que conversam com este</h3>
                <p>Explore em paralelo. Eles não são necessariamente pré-requisitos.</p>
              </div>
            </div>
            <div className="knowledge-map-related-list">{renderConnections(related, selected)}</div>
          </section>
          <p className="knowledge-map-note">
            As setas mostram uma sugestão de sequência de estudo. Os temas relacionados são conexões
            editoriais, não relações de causa e efeito.
          </p>
        </div>
      ) : !selected ? (
        <div className="knowledge-map-empty">
          <Search size={25} aria-hidden="true" />
          <b>Nenhum assunto encontrado</b>
          <span>Altere a busca ou escolha outra área.</span>
        </div>
      ) : null}
    </section>
  );
}
