import { useEffect, useState } from 'react';
import { ArrowRight, BookOpen, ShieldCheck } from 'lucide-react';
import { studyPaths, suggestedNextTopicIds, topics, type Topic } from '@calmandstudy/content';

export type VerifiableSource = { name: string; url: string; kind: string };
export function CheckedSourceLinks({ sources }: { sources: VerifiableSource[] }) {
  const [links, setLinks] = useState<VerifiableSource[] | null>(null);
  useEffect(() => {
    let cancelled = false;
    setLinks(null);
    const params = new URLSearchParams();
    sources.forEach(source => params.append('url', source.url));
    fetch(`/api/links/check?${params.toString()}`)
      .then(response => (response.ok ? response.json() : Promise.reject()))
      .then((data: { links?: { url: string; status: string; httpStatus?: number }[] }) => {
        if (cancelled) return;
        const confirmed = new Set(
          (data.links ?? [])
            .filter(
              link =>
                link.status === 'ok' &&
                link.httpStatus !== undefined &&
                link.httpStatus >= 200 &&
                link.httpStatus < 300,
            )
            .map(link => link.url),
        );
        setLinks(sources.filter(source => confirmed.has(source.url)));
      })
      .catch(() => {
        if (!cancelled) setLinks([]);
      });
    return () => {
      cancelled = true;
    };
  }, [sources]);
  if (!links?.length) return null;
  return (
    <section className="source-list">
      <div className="source-title">
        <h2>De onde vem esse conhecimento?</h2>
        <span>{links.length} links responderam agora</span>
      </div>
      <p>
        O Estude com Calma prioriza referências públicas de universidades, órgãos e instituições de
        pesquisa. Esta checagem confirma somente que o endereço respondeu HTTP 2xx nesta consulta;
        ela não atesta revisão por pares, acesso integral sem paywall ou a veracidade de cada
        afirmação. Consulte as fontes e considere o contexto do artigo. O link permite leitura da
        origem, mas não concede automaticamente licença para republicar seu conteúdo.
      </p>
      {links.map(source => (
        <a
          href={source.url}
          target="_blank"
          rel="noopener noreferrer"
          className="source"
          key={source.url}
        >
          <span className="source-icon">
            <ShieldCheck size={17} />
          </span>
          <span>
            <b>{source.name}</b>
            <small>{source.kind}</small>
          </span>
          <ArrowRight size={16} />
        </a>
      ))}
    </section>
  );
}

export function RecommendedBefore({
  topic,
  onOpen,
}: {
  topic: Topic;
  onOpen: (topic: Topic | null) => void;
}) {
  const explicit = topic.recommendedBefore?.[0];
  const pathSuggestion = studyPaths
    .flatMap(path => {
      const index = path.topicIds.indexOf(topic.id);
      return index > 0 ? [topics.find(candidate => candidate.id === path.topicIds[index - 1])] : [];
    })
    .find((candidate): candidate is Topic => Boolean(candidate));
  const relatedSuggestion = topics.find(candidate =>
    suggestedNextTopicIds[candidate.id]?.includes(topic.id),
  );
  const suggested = explicit?.topicId
    ? topics.find(candidate => candidate.id === explicit.topicId)
    : undefined;
  const before = suggested ?? pathSuggestion ?? relatedSuggestion;
  if (!before) return null;
  return (
    <aside className="prerequisite">
      <div className="prerequisite-icon">
        <BookOpen size={17} />
      </div>
      <div>
        <span className="eyebrow muted">PARA ENTENDER MELHOR · OPCIONAL</span>
        <b className="prerequisite-title">{before.title}</b>
        <p>
          {explicit?.why ??
            `Este assunto apresenta uma ideia anterior que ajuda a construir contexto para ${topic.title}. Você pode ler agora ou continuar sem interrupção.`}
        </p>
        <button className="text-link" onClick={() => onOpen(before)}>
          Ler primeiro <ArrowRight size={14} />
        </button>
      </div>
    </aside>
  );
}
