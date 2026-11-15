import { useEffect, useState } from 'react';
import type { Topic } from '@calmandstudy/content';
import { applyImageTone } from '../shared/imageTone';

type ArtworkMode = 'card' | 'reader';

function TopicIllustration({ topic }: { topic: Topic }) {
  const subject = `${topic.title} ${topic.field} ${topic.tags.join(' ')}`.toLowerCase();
  const theme = /astr|planet|venus|mars|cosmo|celest|orbita|sol/.test(subject)
    ? 'sky'
    : /hist|arque|rota|cuneif|seda|antigo|passado/.test(subject)
      ? 'history'
      : /bio|polvo|gen|fotossínt|vida|evolu|fóssil|fossil/.test(subject)
        ? 'life'
        : /matem|logar|número|estatíst|lógica/.test(subject)
          ? 'math'
          : /geol|terrem|água|oceano|clima|rocha|hidro/.test(subject)
            ? 'earth'
            : 'science';

  return (
    <div
      className={`topic-illustration illustration-${theme}`}
      role="img"
      aria-label={`Ilustração sobre ${topic.title}`}
    >
      <svg viewBox="0 0 360 170" aria-hidden="true">
        <circle cx="42" cy="35" r="2" />
        <circle cx="311" cy="31" r="2" />
        <circle cx="284" cy="121" r="2" />
        <circle cx="74" cy="130" r="1.5" />
        {theme === 'sky' && (
          <>
            <circle className="art-orbit" cx="184" cy="84" r="53" />
            <circle className="art-planet" cx="184" cy="84" r="32" />
            <ellipse
              className="art-ring"
              cx="184"
              cy="84"
              rx="66"
              ry="18"
              transform="rotate(-18 184 84)"
            />
            <circle className="art-moon" cx="246" cy="58" r="8" />
          </>
        )}
        {theme === 'history' && (
          <>
            <path className="art-road" d="M45 125 C105 72 245 103 316 48" />
            <rect
              className="art-tablet"
              x="135"
              y="39"
              width="83"
              height="92"
              rx="18"
              transform="rotate(-8 176 85)"
            />
            <path className="art-mark" d="M155 68l18-4m-19 16 38-5m-36 17 30-4m-28 17 35-5" />
          </>
        )}
        {theme === 'life' && (
          <>
            <circle className="art-cell" cx="180" cy="84" r="49" />
            <circle className="art-core" cx="180" cy="84" r="19" />
            <circle className="art-dot" cx="147" cy="69" r="5" />
            <circle className="art-dot" cx="207" cy="104" r="6" />
            <circle className="art-dot" cx="204" cy="58" r="4" />
            <path className="art-orbit" d="M91 110c34-61 110-72 175-38" />
          </>
        )}
        {theme === 'math' && (
          <>
            <path className="art-axis" d="M105 129V38m0 91h155" />
            <path className="art-curve" d="M116 117c22-1 29-13 42-30s23-29 43-34 32-5 54-6" />
            <circle className="art-dot" cx="158" cy="87" r="5" />
            <circle className="art-dot" cx="201" cy="53" r="5" />
          </>
        )}
        {theme === 'earth' && (
          <>
            <path className="art-mountain" d="M67 120l49-62 38 42 35-55 61 75z" />
            <path className="art-wave" d="M75 132c23-11 42 11 65 0s43 11 66 0 43 11 66 0" />
            <circle className="art-sun" cx="270" cy="47" r="13" />
          </>
        )}
        {theme === 'science' && (
          <>
            <circle className="art-orbit" cx="180" cy="84" r="48" />
            <ellipse
              className="art-ring"
              cx="180"
              cy="84"
              rx="73"
              ry="25"
              transform="rotate(31 180 84)"
            />
            <circle className="art-core" cx="180" cy="84" r="13" />
            <circle className="art-dot" cx="244" cy="48" r="7" />
            <circle className="art-dot" cx="122" cy="119" r="6" />
          </>
        )}
      </svg>
    </div>
  );
}

/** Offline, deterministic illustrations avoid blank cards and third-party image requests. */
export function TopicArtwork({ topic, mode }: { topic: Topic; mode: ArtworkMode }) {
  const [imageFailed, setImageFailed] = useState(false);
  // Version the public path so browsers and the service worker don't reuse
  // the older, low-resolution artwork stored under the same topic id.
  const source = `/images/topics/ai-generated/${topic.id}.jpg?v=20261113`;
  const imagePosition: Record<string, string> = {
    'mars-sol': 'center 55%',
    'mars-atmosphere-loss': 'center 52%',
    'venus-retrograde': 'center 50%',
    'moon-giant-impact': 'center 60%',
    octopus: 'center 50%',
  };
  useEffect(() => setImageFailed(false), [topic.id]);

  return (
    <figure className={mode === 'reader' ? 'reader-image' : 'topic-image'}>
      {!imageFailed && (
        <img
          className="topic-generated-image"
          src={source}
          alt={`Ilustração sobre ${topic.title}`}
          style={{ objectPosition: imagePosition[topic.id] ?? 'center' }}
          loading={mode === 'card' ? 'lazy' : 'eager'}
          decoding="async"
          onLoad={event => applyImageTone(event.currentTarget)}
          onError={() => setImageFailed(true)}
        />
      )}
      <div className="topic-art-fallback" hidden={!imageFailed}>
        <TopicIllustration topic={topic} />
      </div>
      <figcaption className="visually-hidden">
        {imageFailed
          ? 'Ilustração vetorial de reserva; representação artística, não é evidência documental.'
          : 'Imagem de aparência fotográfica gerada por IA; representação artística, não é evidência documental.'}
      </figcaption>
    </figure>
  );
}
