import { BarChart3, Eye, Heart, Info, Sparkles, TrendingUp } from 'lucide-react';
import type { StudyPath, Topic, Tutorial } from '@calmandstudy/content';
import { ContentLikeButton } from './ContentLikeButton';
import type { EngagementContentType, EngagementItem } from './types';
import type { LearningMode } from '../preferences/learning-mode';

type Props = {
  mode: LearningMode;
  topics: Topic[];
  paths: StudyPath[];
  tutorials: Tutorial[];
  available: boolean;
  get: (type: EngagementContentType, id: string) => EngagementItem;
  onToggleLike: (type: EngagementContentType, id: string) => void;
};

export function EngagementDashboard({
  mode,
  topics,
  paths,
  tutorials,
  available,
  get,
  onToggleLike,
}: Props) {
  const adventure = mode === 'adventure';
  const entries = [
    ...topics.map(item => ({
      type: 'article' as const,
      title: item.title,
      metric: get('article', item.id),
    })),
    ...paths.map(item => ({
      type: 'trail' as const,
      title: item.title,
      metric: get('trail', item.id),
    })),
    ...tutorials.map(item => ({
      type: 'tutorial' as const,
      title: item.title,
      metric: get('tutorial', item.id),
    })),
  ];
  const reads = entries.reduce((sum, item) => sum + item.metric.reads, 0);
  const likes = entries.reduce((sum, item) => sum + item.metric.likes, 0);
  const topArticles = entries
    .filter(item => item.type === 'article')
    .filter(item => item.metric.reads > 0)
    .sort(
      (a, b) =>
        b.metric.reads - a.metric.reads ||
        b.metric.likes - a.metric.likes ||
        a.title.localeCompare(b.title, 'pt-BR'),
    )
    .slice(0, 8);
  const topLiked = [...entries]
    .filter(item => item.metric.likes > 0)
    .sort(
      (a, b) =>
        b.metric.likes - a.metric.likes ||
        b.metric.reads - a.metric.reads ||
        a.title.localeCompare(b.title, 'pt-BR'),
    )
    .slice(0, 8);
  const list = (items: typeof entries, metric: 'reads' | 'likes') => {
    const maxValue = Math.max(...items.map(item => item.metric[metric]), 1);
    return (
      <ol>
        {items.map((item, index) => (
          <li key={`${item.type}:${item.metric.id}`}>
            <span className="engagement-rank" aria-hidden="true">
              {String(index + 1).padStart(2, '0')}
            </span>
            <span>
              <b>{item.title}</b>
              <small>
                {item.type === 'article' ? 'Artigo' : item.type === 'trail' ? 'Trilha' : 'Tutorial'}{' '}
                ·{' '}
                {metric === 'reads'
                  ? `${item.metric.reads.toLocaleString('pt-BR')} leituras`
                  : `${item.metric.likes.toLocaleString('pt-BR')} curtidas`}
              </small>
              <span className="engagement-bar" aria-hidden="true">
                <i style={{ width: `${Math.max(6, (item.metric[metric] / maxValue) * 100)}%` }} />
              </span>
            </span>
            <ContentLikeButton
              item={item.metric}
              disabled={!available}
              onClick={() => onToggleLike(item.type, item.metric.id)}
            />
          </li>
        ))}
      </ol>
    );
  };
  return (
    <section className="engagement-page" aria-labelledby="engagement-title">
      <header className={`engagement-hero ${adventure ? 'engagement-hero-adventure' : ''}`}>
        <div className="eyebrow">
          <Sparkles size={15} aria-hidden="true" />
          {adventure ? 'PLACAR DA EXPEDIÇÃO' : 'CURIOSIDADE EM MOVIMENTO'}
        </div>
        <h1 id="engagement-title">
          {adventure ? 'Quais descobertas estão em alta?' : 'O que anda despertando curiosidade?'}
        </h1>
        <p>
          {adventure
            ? 'Acompanhe as leituras e recomendações da comunidade nesta expedição.'
            : 'Veja os assuntos que estão sendo lidos e curtidos por quem explora a Sala de Calma e Estudo.'}
        </p>
        <span className="engagement-hero-note">
          <TrendingUp size={15} aria-hidden="true" />
          {adventure ? 'Leituras e escolhas da comunidade' : 'Leituras e curtidas da comunidade'}
        </span>
      </header>
      <div className="engagement-summary">
        <article className="engagement-stat engagement-stat-reads">
          <span className="engagement-stat-icon">
            <Eye size={19} aria-hidden="true" />
          </span>
          <span className="engagement-stat-label">LEITURAS REGISTRADAS</span>
          <b>{reads.toLocaleString('pt-BR')}</b>
          <span className="engagement-stat-caption">Artigos, trilhas e tutoriais explorados</span>
        </article>
        <article className="engagement-stat engagement-stat-likes">
          <span className="engagement-stat-icon">
            <Heart size={19} aria-hidden="true" />
          </span>
          <span className="engagement-stat-label">CURTIDAS</span>
          <b>{likes.toLocaleString('pt-BR')}</b>
          <span className="engagement-stat-caption">Temas que a comunidade recomenda</span>
        </article>
      </div>
      {!available && (
        <p className="engagement-unavailable" role="status">
          <Info size={16} aria-hidden="true" /> Estamos preparando os números da comunidade. Tente
          novamente mais tarde.
        </p>
      )}
      <div className="engagement-rankings">
        <section>
          <div className="engagement-ranking-heading">
            <span className="engagement-ranking-icon">
              <Eye size={17} aria-hidden="true" />
            </span>
            <div>
              <span className="eyebrow muted">DESCOBERTAS EM ALTA</span>
              <h2>Mais lidos</h2>
            </div>
          </div>
          {topArticles.length ? (
            list(topArticles, 'reads')
          ) : (
            <p>Ainda não há leituras registradas.</p>
          )}
        </section>
        <section>
          <div className="engagement-ranking-heading">
            <span className="engagement-ranking-icon is-liked">
              <Heart size={17} aria-hidden="true" />
            </span>
            <div>
              <span className="eyebrow muted">ESCOLHAS DA COMUNIDADE</span>
              <h2>Mais curtidos</h2>
            </div>
          </div>
          {topLiked.length ? list(topLiked, 'likes') : <p>Ainda não há curtidas registradas.</p>}
        </section>
      </div>
      <p className="engagement-privacy">
        Cada navegador pode registrar uma leitura e uma curtida por conteúdo. Os totais são
        apresentados de forma agregada; sem conta, a atividade pode ser redefinida ao limpar os
        dados do navegador.
      </p>
    </section>
  );
}
