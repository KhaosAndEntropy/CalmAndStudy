import { memo, useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  BookOpen,
  Clock3,
  History,
  Lightbulb,
  Share2,
  ShieldCheck,
  Shuffle,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react';
import { expandedReading } from '@calmandstudy/content/expanded';
import {
  buildTopicAssessment,
  confidenceMethod,
  editorialPublishingPolicy,
  suggestedNextTopicIds,
  topics,
  type Topic,
} from '@calmandstudy/content';
import { CheckedSourceLinks, RecommendedBefore, type VerifiableSource } from './ReaderSupport';
import { TopicArtwork } from '../topics/TopicArtwork';
import { ArticleExercises } from './ArticleExercises';
import { ContentLikeButton } from '../engagement/ContentLikeButton';
import type { EngagementItem } from '../engagement/types';
import { ReadStatusButton } from './ReadStatusButton';
import { KnowledgeAssessment } from '../assessment/KnowledgeAssessment';
import { areaToneStyle } from '../shared/areaTone';
type ReaderDialogProps = {
  topic: Topic;
  saved: boolean;
  readingProgress: boolean;
  sourceCandidates: VerifiableSource[];
  onClose: () => void;
  onOpenTopic: (topic: Topic | null) => void;
  onToggleSaved: () => void;
  onReview: (topic: Topic) => void;
  onRandom: () => void;
  engagementAvailable: boolean;
  engagement: EngagementItem;
  onToggleLike: () => void;
  read: boolean;
  onToggleRead: () => void;
};

function SavedArticleButton({
  saved,
  onToggleSaved,
}: {
  saved: boolean;
  onToggleSaved: () => void;
}) {
  const [isSaved, setIsSaved] = useState(saved);
  useEffect(() => setIsSaved(saved), [saved]);
  return (
    <button
      className={`outline-btn ${isSaved ? 'saved' : ''}`}
      onClick={() => {
        setIsSaved(value => !value);
        onToggleSaved();
      }}
      aria-pressed={isSaved}
    >
      <Bookmark size={16} fill={isSaved ? 'currentColor' : 'none'} />
      {isSaved ? 'Salvo' : 'Salvar descoberta'}
    </button>
  );
}

function ReaderDialogView({
  topic,
  saved,
  readingProgress,
  sourceCandidates,
  onClose,
  onOpenTopic,
  onToggleSaved,
  onReview,
  onRandom,
  engagementAvailable,
  engagement,
  onToggleLike,
  read,
  onToggleRead,
}: ReaderDialogProps) {
  const current = topic;
  const [isNarrating, setIsNarrating] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [shareMessage, setShareMessage] = useState('');
  const readerBodyRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const progressFrameRef = useRef<number | null>(null);
  const canNarrate = typeof window !== 'undefined' && 'speechSynthesis' in window;
  const narration = [
    current.title,
    current.summary,
    'A descoberta.',
    current.fact,
    current.detail,
    ...(expandedReading[current.id] ?? []).flatMap(section => [section.title, section.body]),
  ].join('. ');
  useEffect(() => {
    setIsNarrating(false);
    setShareMessage('');
    if (readerBodyRef.current) readerBodyRef.current.scrollTop = 0;
    if (progressBarRef.current) {
      progressBarRef.current.style.transform = 'scaleX(0)';
      progressBarRef.current.setAttribute('aria-valuenow', '0');
    }
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window)
        window.speechSynthesis.cancel();
    };
  }, [current.id]);
  useEffect(
    () => () => {
      if (progressFrameRef.current !== null) window.cancelAnimationFrame(progressFrameRef.current);
    },
    [],
  );
  const updateReadingProgress = () => {
    if (progressFrameRef.current !== null) window.cancelAnimationFrame(progressFrameRef.current);
    progressFrameRef.current = window.requestAnimationFrame(() => {
      const body = readerBodyRef.current;
      const bar = progressBarRef.current;
      if (!body || !bar) return;
      const range = body.scrollHeight - body.clientHeight;
      const percent = range > 0 ? Math.min(100, Math.round((body.scrollTop / range) * 100)) : 100;
      bar.style.transform = `scaleX(${percent / 100})`;
      bar.setAttribute('aria-valuenow', String(percent));
    });
  };
  const toggleNarration = () => {
    if (!canNarrate) return;
    if (isNarrating) {
      window.speechSynthesis.cancel();
      setIsNarrating(false);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(narration);
    utterance.lang = 'pt-BR';
    utterance.onend = () => setIsNarrating(false);
    utterance.onerror = () => setIsNarrating(false);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    setIsNarrating(true);
  };
  const shareArticle = async () => {
    if (isSharing) return;
    setIsSharing(true);
    setShareMessage('');
    const articleUrl = new URL(window.location.href);
    articleUrl.searchParams.set('artigo', current.id);
    const shareData = {
      title: current.title,
      text: current.summary,
      url: articleUrl.toString(),
    };
    const copyLink = async () => {
      if (navigator.clipboard?.writeText && window.isSecureContext) {
        await navigator.clipboard.writeText(shareData.url);
        return;
      }
      const temporaryInput = document.createElement('textarea');
      temporaryInput.value = shareData.url;
      temporaryInput.setAttribute('readonly', '');
      temporaryInput.style.position = 'fixed';
      temporaryInput.style.opacity = '0';
      document.body.append(temporaryInput);
      temporaryInput.select();
      const copied = document.execCommand('copy');
      temporaryInput.remove();
      if (!copied) throw new Error('Clipboard unavailable');
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
        setShareMessage('Artigo compartilhado.');
      } else {
        await copyLink();
        setShareMessage('Link do artigo copiado.');
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        setIsSharing(false);
        return;
      }
      try {
        await copyLink();
        setShareMessage('Não foi possível abrir o compartilhamento. Copiamos o link do artigo.');
      } catch {
        setShareMessage('Não foi possível compartilhar agora. Tente novamente.');
      }
    } finally {
      setIsSharing(false);
    }
  };
  return (
    <div
      className="overlay"
      onMouseDown={e => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <section className="reader">
        <div className="reader-head">
          <button className="back-btn" onClick={() => onClose()}>
            <ArrowLeft size={16} /> Voltar às descobertas
          </button>
          <button className="icon-btn" onClick={() => onClose()} aria-label="Fechar">
            <X size={19} />
          </button>
        </div>
        {readingProgress && (
          <div className="reader-progress-track">
            <div
              ref={progressBarRef}
              className="reader-progress-value"
              role="progressbar"
              aria-label="Progresso da leitura"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={0}
            />
          </div>
        )}
        <div
          className="reader-body"
          ref={readerBodyRef}
          onScroll={readingProgress ? updateReadingProgress : undefined}
        >
          <div className="eyebrow">
            <span className="field-tag" style={areaToneStyle(current.field)}>
              <History size={13} />
              {current.field}
            </span>
            <span>·</span>
            {current.period}
          </div>
          <h1>{current.title}</h1>
          <p className="reader-dek">{current.summary}</p>
          <div className="reader-audio">
            <button
              className="outline-btn"
              onClick={toggleNarration}
              disabled={!canNarrate}
              aria-pressed={isNarrating}
            >
              {isNarrating ? <VolumeX size={16} /> : <Volume2 size={16} />}{' '}
              {isNarrating ? 'Parar narração' : 'Ouvir artigo'}
            </button>
            <span>
              {canNarrate
                ? 'Narração em português pelo navegador'
                : 'Narração indisponível neste navegador'}
            </span>
          </div>
          <RecommendedBefore topic={current} onOpen={onOpenTopic} />
          <TopicArtwork topic={current} mode="reader" />
          <div className="reader-stats">
            <span>
              <Clock3 size={15} />
              {current.readingTime} min de leitura
            </span>
            <span>
              <ShieldCheck size={15} />
              {current.editorial?.status === 'published' && current.editorial.assessment
                ? `Índice editorial: ${current.editorial.assessment.score}%`
                : 'Verificação editorial pendente'}
            </span>
          </div>
          <div className="reader-engagement-actions">
            <ReadStatusButton read={read} onToggle={onToggleRead} />
            <ContentLikeButton
              item={engagement}
              disabled={!engagementAvailable}
              onClick={onToggleLike}
            />
          </div>
          <div className="confidence">
            <div className="confidence-top">
              <span>
                <ShieldCheck size={17} />{' '}
                {current.editorial?.status === 'published'
                  ? 'Revisão editorial publicada'
                  : 'Verificação editorial pendente'}
              </span>
              <b>
                {current.editorial?.status === 'published' && current.editorial.assessment
                  ? `${current.editorial.assessment.score}%`
                  : 'Ainda sem nota'}
              </b>
            </div>
            {current.editorial?.status === 'published' && current.editorial.assessment ? (
              <progress
                className="meter"
                max={100}
                value={current.editorial.assessment.score}
                aria-label="Pontuação da revisão editorial"
              />
            ) : null}
            <p>
              {current.editorial?.status === 'published' && current.editorial.assessment
                ? current.editorial.assessment.rationale
                : 'Este artigo ainda não passou pelo padrão editorial de publicação da Calm & Study. As fontes listadas no catálogo antigo não foram auditadas uma a uma; por isso, não mostramos uma porcentagem como se fosse verificada.'}
            </p>
            <div className="signals">
              <span>
                • Para publicação, cada afirmação precisa de pelo menos três fontes confirmatórias
                de grupos editoriais independentes
              </span>
              <span>
                {current.editorial?.status === 'published'
                  ? '• As afirmações e os trechos de evidência estão apresentados abaixo'
                  : '• Também conferimos texto integral aberto, ausência de paywall e acesso recente'}
              </span>
              <span>
                • Confira as fontes originais e considere o contexto e as ressalvas do texto
              </span>
              <span>• Situação editorial: {current.confidenceLabel}</span>
            </div>
            {current.editorial?.status === 'published' && current.editorial.assessment ? (
              <details className="confidence-method">
                <summary>Metodologia e limitações</summary>
                <p>
                  {current.editorial.assessment.method}: cobertura{' '}
                  {current.editorial.assessment.dimensions.claimCoverage}/100; qualidade da
                  evidência {current.editorial.assessment.dimensions.evidenceQuality}/100;
                  independência {current.editorial.assessment.dimensions.sourceIndependence}/100;
                  concordância {current.editorial.assessment.dimensions.sourceAgreement}/100;
                  atualidade {current.editorial.assessment.dimensions.timeliness}/100; transparência
                  das incertezas {current.editorial.assessment.dimensions.uncertaintyDisclosure}
                  /100.
                </p>
                <p>{current.editorial.assessment.limitations.join(' ')}</p>
                <p>
                  Revisado por {current.editorial.reviewedBy} em {current.editorial.reviewedAt}.
                </p>
              </details>
            ) : (
              <details className="confidence-method">
                <summary>Regra de publicação e cálculo</summary>
                <p>
                  {editorialPublishingPolicy.explanation} A nota é um indicador da qualidade da
                  documentação, não a probabilidade matemática de o artigo estar correto. Só
                  exibimos o índice após a revisão humana registrada.
                </p>
                <ul>
                  {Object.entries(confidenceMethod.weights).map(([dimension, weight]) => (
                    <li key={dimension}>
                      {dimension === 'claimCoverage'
                        ? 'Cobertura das afirmações'
                        : dimension === 'evidenceQuality'
                          ? 'Qualidade da evidência'
                          : dimension === 'sourceIndependence'
                            ? 'Independência das fontes'
                            : dimension === 'sourceAgreement'
                              ? 'Concordância entre fontes'
                              : dimension === 'timeliness'
                                ? 'Atualidade'
                                : 'Transparência das incertezas'}{' '}
                      · {weight}%
                    </li>
                  ))}
                </ul>
                <p>
                  Cada dimensão recebe nota de 0 a 100. Somamos cada nota multiplicada pelo peso e
                  dividimos por 100; o resultado é arredondado para o inteiro mais próximo. A
                  publicação exige pelo menos 80/100, as três fontes por afirmação e revisão humana.
                </p>
              </details>
            )}
          </div>
          <h2>A descoberta</h2>
          <p className="fact">{current.fact}</p>
          <p>{current.detail}</p>
          {expandedReading[current.id]?.map(section => (
            <section className="expanded-section" key={section.title}>
              <h2>{section.title}</h2>
              <p>{section.body}</p>
            </section>
          ))}
          {current.editorial?.status === 'published' && (
            <section className="claim-evidence">
              <h2>Como sabemos disso?</h2>
              <p>
                Revisado em {current.editorial.reviewedAt} por {current.editorial.reviewedBy}. Cada
                afirmação é ligada às evidências disponíveis.
              </p>
              {current.editorial.claims.map(claim => (
                <article className="claim-item" key={claim.id}>
                  <b>{claim.text}</b>
                  <small>
                    {claim.kind === 'established'
                      ? 'Fato estabelecido'
                      : claim.kind === 'interpretation'
                        ? 'Interpretação'
                        : claim.kind === 'hypothesis'
                          ? 'Hipótese'
                          : 'Tema em debate'}
                    {claim.uncertainty ? ` · ${claim.uncertainty}` : ''}
                  </small>
                  {claim.evidence.map((evidence, index) => {
                    const source = current.editorial?.sources.find(
                      item => item.id === evidence.sourceId,
                    );
                    return source ? (
                      <a
                        className="claim-source"
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        key={`${claim.id}-${index}`}
                      >
                        <strong>
                          {source.title} · {source.publisher}
                        </strong>
                        <small>
                          {source.kind}
                          {source.authors?.length ? ` · ${source.authors.join(', ')}` : ''}
                          {source.publishedAt ? ` · publicado em ${source.publishedAt}` : ''}
                          {source.doi ? ` · DOI ${source.doi}` : ''}
                          {source.license ? ` · ${source.license}` : ''}
                        </small>
                        <q>{evidence.excerpt}</q>
                        <small>
                          {evidence.relation === 'supports'
                            ? 'Sustenta'
                            : evidence.relation === 'qualifies'
                              ? 'Qualifica'
                              : 'Contrapõe'}{' '}
                          · consultado em {evidence.accessedAt}
                          {evidence.locator ? ` · ${evidence.locator}` : ''}
                        </small>
                      </a>
                    ) : null;
                  })}
                </article>
              ))}
            </section>
          )}
          <section className="article-takeaway" aria-labelledby="article-takeaway-title">
            <span className="eyebrow muted">PARA LEVAR COM VOCÊ</span>
            <h2 id="article-takeaway-title">Em poucas palavras</h2>
            <p>
              Em resumo, {current.summary} A ideia principal para guardar é: {current.fact}
            </p>
          </section>
          <ArticleExercises topic={current} />
          <div className="reader-buttons">
            <button className="outline-btn" onClick={() => onReview(current)}>
              <Lightbulb size={16} />
              Sugerir revisão do artigo
            </button>
            <SavedArticleButton key={current.id} saved={saved} onToggleSaved={onToggleSaved} />
            <button
              className="outline-btn article-share-button"
              onClick={() => void shareArticle()}
              disabled={isSharing}
            >
              <Share2 size={16} />
              {isSharing ? 'Preparando…' : 'Compartilhar artigo'}
            </button>
            {shareMessage && (
              <span className="share-feedback" role="status" aria-live="polite">
                {shareMessage}
              </span>
            )}
          </div>
          <CheckedSourceLinks sources={sourceCandidates} />
          <KnowledgeAssessment assessment={buildTopicAssessment(current, topics)} />
          {suggestedNextTopicIds[current.id]?.filter(id => topics.some(topic => topic.id === id))
            .length ? (
            suggestedNextTopicIds[current.id]
              .filter(id => topics.some(topic => topic.id === id))
              .map(id => {
                const next = topics.find(t => t.id === id);
                return next ? (
                  <button className="forward-topic" key={id} onClick={() => onOpenTopic(next)}>
                    <span className="tiny-icon">
                      <ArrowRight size={16} />
                    </span>
                    <span>
                      <small>PARA CONTINUAR · TEMA CONECTADO</small>
                      <b>{next.title}</b>
                      <em>Esta leitura amplia a ideia e segue a sequência sugerida.</em>
                    </span>
                    <ArrowRight size={17} />
                  </button>
                ) : null;
              })
          ) : (
            <aside className="article-journey-end" role="status">
              <span className="eyebrow muted">FIM DESTE PERCURSO</span>
              <b>Muito bem — você chegou ao fim deste artigo.</b>
              <p>
                Por enquanto, ainda não há outro tema conectado a esta leitura. Estamos ampliando as
                conexões do catálogo para sugerir novos caminhos em breve.
              </p>
            </aside>
          )}
          <button className="next-fact" onClick={onRandom}>
            <span className="tiny-icon">
              <Shuffle size={16} />
            </span>
            <span>
              <b>Mais uma descoberta?</b>
              <small>Deixe a curiosidade escolher o próximo tema.</small>
            </span>
            <ArrowRight size={17} />
          </button>
        </div>
      </section>
    </div>
  );
}

export const ReaderDialog = memo(
  ReaderDialogView,
  (previous, next) =>
    previous.topic === next.topic &&
    previous.readingProgress === next.readingProgress &&
    previous.sourceCandidates === next.sourceCandidates &&
    previous.onClose === next.onClose &&
    previous.onOpenTopic === next.onOpenTopic &&
    previous.onToggleSaved === next.onToggleSaved &&
    previous.onReview === next.onReview &&
    previous.onRandom === next.onRandom &&
    previous.engagementAvailable === next.engagementAvailable &&
    previous.engagement === next.engagement &&
    previous.onToggleLike === next.onToggleLike &&
    previous.read === next.read &&
    previous.onToggleRead === next.onToggleRead,
);
