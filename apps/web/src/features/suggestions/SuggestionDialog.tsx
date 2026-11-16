import { type FormEvent } from 'react';
import { ArrowRight, Download, LoaderCircle, RefreshCw, X } from 'lucide-react';
import type { TopicSuggestion, TopicSuggestionDraft } from './types';

type SuggestionDialogProps = {
  draft: TopicSuggestionDraft;
  setDraft: (update: (draft: TopicSuggestionDraft) => TopicSuggestionDraft) => void;
  suggestions: TopicSuggestion[];
  submitting: boolean;
  message: string;
  onClose: () => void;
  onSave: (event: FormEvent<HTMLFormElement>) => void;
  onRetry: () => void;
};

export function SuggestionDialog({
  draft,
  setDraft,
  suggestions,
  submitting,
  message,
  onClose,
  onSave,
  onRetry,
}: SuggestionDialogProps) {
  const setSuggestionDraft = setDraft;

  const downloadQueue = () => {
    const json = {
      format: 'calmandstudy-submissions',
      version: 1,
      kind: 'suggestions',
      exportedAt: new Date().toISOString(),
      suggestions,
    };
    const blob = new Blob([JSON.stringify(json, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'calmandstudy-sugestoes-pendentes.json';
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return (
    <div
      className="overlay"
      onMouseDown={event => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        className="suggestion-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="suggestion-title"
        aria-describedby="suggestion-note"
      >
        <header className="dialog-head">
          <div>
            <span className="eyebrow muted">PAUTA COM PARTICIPAÇÃO</span>
            <h2 id="suggestion-title">
              {draft.kind === 'review' ? 'Sugerir revisão do artigo' : 'Sugira um próximo tema'}
            </h2>
          </div>
          <button className="icon-btn" aria-label="Fechar" onClick={onClose}>
            <X size={19} />
          </button>
        </header>
        <p id="suggestion-note" className="local-only-note">
          Seu envio vai para uma fila de revisão editorial. Ele não é publicado automaticamente. Se
          a conexão falhar ou o limite diário for atingido, guardamos uma cópia neste dispositivo.
        </p>
        {message && (
          <div className="research-error" role="alert">
            {message}
          </div>
        )}
        <form className="suggestion-form" method="post" autoComplete="off" onSubmit={onSave}>
          {draft.kind === 'review' ? (
            <label>
              Artigo relacionado
              <input value={draft.articleTitle ?? draft.title} readOnly maxLength={160} />
            </label>
          ) : (
            <label>
              Tema ou pergunta
              <input
                required
                maxLength={120}
                value={draft.title}
                onChange={event =>
                  setSuggestionDraft(current => ({ ...current, title: event.target.value }))
                }
                placeholder="Ex.: Como sabemos a idade dos fósseis?"
              />
            </label>
          )}
          <label>
            Ciência ou área
            <input
              required
              maxLength={80}
              value={draft.field}
              onChange={event =>
                setSuggestionDraft(current => ({ ...current, field: event.target.value }))
              }
              placeholder="Ex.: Paleontologia"
            />
          </label>
          <label>
            {draft.kind === 'review'
              ? 'O que precisa ser revisto, esclarecido ou complementado?'
              : 'O que despertou sua curiosidade?'}
            <textarea
              required
              maxLength={600}
              rows={3}
              value={draft.reason}
              onChange={event =>
                setSuggestionDraft(current => ({ ...current, reason: event.target.value }))
              }
              placeholder={
                draft.kind === 'review'
                  ? 'Aponte o trecho ou afirmação e explique a correção ou ressalva sugerida.'
                  : 'Conte o que gostaria de entender e por quê.'
              }
            />
          </label>
          {draft.kind === 'topic' ? (
            <fieldset className="suggestion-sources">
              <legend>Três fontes independentes (obrigatório)</legend>
              <p>
                Informe instituições ou publicações com responsabilidade editorial própria. Três
                páginas da mesma organização contam como uma fonte. A equipe conferirá os links e as
                evidências antes de decidir sobre a publicação. Enviar um link não concede permissão
                para copiar ou republicar o material indicado.
              </p>
              <p className="suggestion-editorial-boundary">
                Não aceitamos pautas controversas, partidárias ou centradas em disputas ideológicas.
                O Estude com Calma prioriza temas educativos, verificáveis e apresentados com
                respeito às pessoas.
              </p>
              <label className="suggestion-policy-confirmation">
                <input type="checkbox" name="editorialPolicyAccepted" required />
                <span>
                  Confirmo que a proposta é educativa, respeitosa e não se enquadra nos temas
                  editoriais recusados acima. Entendo que o envio será analisado por uma pessoa e
                  não garante publicação.
                </span>
              </label>
              {[0, 1, 2].map(index => (
                <div className="suggestion-source-row" key={index}>
                  <label>
                    Instituição ou publicação {index + 1}
                    <input
                      required
                      maxLength={160}
                      value={draft.sources?.[index]?.publisher ?? ''}
                      onChange={event =>
                        setSuggestionDraft(current => {
                          const sources = Array.from({ length: 3 }, (_, sourceIndex) => ({
                            publisher: current.sources?.[sourceIndex]?.publisher ?? '',
                            url: current.sources?.[sourceIndex]?.url ?? '',
                          }));
                          sources[index].publisher = event.target.value;
                          return { ...current, sources };
                        })
                      }
                      placeholder="Ex.: universidade, museu, órgão público"
                    />
                  </label>
                  <label>
                    Link HTTPS {index + 1}
                    <input
                      required
                      type="url"
                      maxLength={500}
                      value={draft.sources?.[index]?.url ?? ''}
                      onChange={event =>
                        setSuggestionDraft(current => {
                          const sources = Array.from({ length: 3 }, (_, sourceIndex) => ({
                            publisher: current.sources?.[sourceIndex]?.publisher ?? '',
                            url: current.sources?.[sourceIndex]?.url ?? '',
                          }));
                          sources[index].url = event.target.value;
                          return { ...current, sources };
                        })
                      }
                      placeholder="https://…"
                    />
                  </label>
                </div>
              ))}
            </fieldset>
          ) : (
            <label>
              Fonte que sustenta a sugestão (opcional)
              <input
                type="url"
                maxLength={500}
                value={draft.source}
                onChange={event =>
                  setSuggestionDraft(current => ({ ...current, source: event.target.value }))
                }
                placeholder="https://…"
              />
            </label>
          )}
          <button className="primary" type="submit" disabled={submitting}>
            {submitting ? <LoaderCircle className="spin" size={15} /> : null}
            {submitting ? 'Enviando' : 'Enviar para revisão'} <ArrowRight size={15} />
          </button>
        </form>
        <section className="suggestion-queue">
          <div>
            <b>{suggestions.length} envio(s) pendente(s) neste dispositivo</b>
            <small>
              Ao reenviar uma pauta, você confirma os limites editoriais acima. Os itens só saem
              daqui quando o servidor confirmar o recebimento.
            </small>
          </div>
          <div className="workbench-actions">
            <button
              className="outline-btn"
              disabled={!suggestions.length || submitting}
              onClick={onRetry}
            >
              <RefreshCw size={14} /> Reenviar pendentes
            </button>
            <button className="outline-btn" disabled={!suggestions.length} onClick={downloadQueue}>
              <Download size={14} /> Baixar cópia JSON
            </button>
          </div>
        </section>
        {!!suggestions.length && (
          <small className="local-only-note">
            A cópia JSON serve apenas como backup manual; o site não importa arquivos.
          </small>
        )}
      </section>
    </div>
  );
}
