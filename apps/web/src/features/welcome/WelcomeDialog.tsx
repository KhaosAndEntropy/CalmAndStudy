import { useState } from 'react';
import { ArrowRight, BookOpen, Compass, Gamepad2, Heart, Sparkles, X } from 'lucide-react';
import type { LearningMode } from '../preferences/learning-mode';
import { recommendModeFromContext } from './context-recommendation';

type WelcomeStep = 'paths' | 'support';

export function WelcomeDialog({
  onClose,
  onQuick,
  onTour,
  onModeSelect,
}: {
  onClose: () => void;
  onQuick: () => void;
  onTour: () => void;
  onModeSelect: (mode: LearningMode) => void;
}) {
  const [step, setStep] = useState<WelcomeStep>('paths');
  const [optionalContext, setOptionalContext] = useState('');
  const contextRecommendation = recommendModeFromContext(optionalContext);

  const chooseMode = (mode: LearningMode) => {
    onModeSelect(mode);
    onClose();
  };

  return (
    <div
      className="overlay welcome-overlay"
      onMouseDown={event => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        className="welcome-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="welcome-dialog-title"
        aria-describedby="welcome-dialog-description"
      >
        <button
          className="welcome-dialog-close icon-btn"
          onClick={onClose}
          aria-label="Fechar apresentação"
        >
          <X size={19} aria-hidden="true" />
        </button>
        <div className="welcome-dialog-mark">
          <Sparkles size={19} aria-hidden="true" />
        </div>
        <div className="eyebrow">BOAS-VINDAS À SALA DE CALMA E ESTUDO</div>
        <h2 id="welcome-dialog-title">
          {step === 'support' ? 'Você merece apoio de verdade.' : 'Como você quer aprender hoje?'}
        </h2>
        <p id="welcome-dialog-description">
          {step === 'support'
            ? 'Esta Sala não substitui ajuda profissional. Se algo estiver pesado, há pessoas e serviços preparados para conversar e cuidar de você.'
            : 'Escolha seu caminho. Os artigos, as fontes e o cuidado com a informação são os mesmos; muda a experiência de navegação.'}
        </p>

        {step === 'paths' ? (
          <>
            <details className="welcome-optional-checkin">
              <summary>
                Quer contar como está se sentindo ou o que te trouxe aqui? (opcional)
              </summary>
              <label className="welcome-check-in-prompt" htmlFor="welcome-optional-context">
                <span>Não é uma avaliação. O texto fica nesta tela e não é salvo nem enviado.</span>
                <textarea
                  id="welcome-optional-context"
                  value={optionalContext}
                  onChange={event => setOptionalContext(event.target.value.slice(0, 500))}
                  maxLength={500}
                  rows={3}
                  placeholder="Se quiser, escreva algumas palavras. Não inclua dados pessoais."
                />
              </label>
              {optionalContext.trim() && (
                <section className="welcome-context-recommendation" aria-live="polite">
                  <b>Uma sugestão, sem compromisso</b>
                  <p>
                    {contextRecommendation.mode === 'calm'
                      ? 'Talvez o Estudo calmo combine com o que você procura agora.'
                      : contextRecommendation.mode === 'adventure'
                        ? 'Talvez o Modo aventura combine com o que você procura agora.'
                        : 'Não há uma preferência clara — você pode escolher livremente.'}
                  </p>
                  <p>É só uma sugestão a partir deste texto; você decide e pode mudar depois.</p>
                  {contextRecommendation.mode && (
                    <button
                      className="welcome-context-use-mode"
                      onClick={() => chooseMode(contextRecommendation.mode!)}
                    >
                      Usar{' '}
                      {contextRecommendation.mode === 'calm' ? 'Estudo calmo' : 'Modo aventura'}
                      <ArrowRight size={15} aria-hidden="true" />
                    </button>
                  )}
                  {contextRecommendation.mentionsDistress && (
                    <button className="welcome-context-support" onClick={() => setStep('support')}>
                      Ver acolhimento e opções de apoio <Heart size={15} aria-hidden="true" />
                    </button>
                  )}
                </section>
              )}
            </details>
            <div className="welcome-choices">
              <button className="welcome-choice" onClick={() => chooseMode('calm')}>
                <span className="welcome-choice-icon">
                  <BookOpen size={19} aria-hidden="true" />
                </span>
                <span className="welcome-choice-copy">
                  <b>Estudo calmo</b>
                  <small>
                    Leituras, fontes e trilhas com uma apresentação discreta. Você escolhe por onde
                    seguir.
                  </small>
                  <span className="welcome-choice-action">
                    Estudar com calma <ArrowRight size={15} aria-hidden="true" />
                  </span>
                </span>
              </button>
              <button
                className="welcome-choice welcome-choice-adventure"
                onClick={() => chooseMode('adventure')}
              >
                <span className="welcome-choice-icon">
                  <Gamepad2 size={19} aria-hidden="true" />
                </span>
                <span className="welcome-choice-copy">
                  <b>Modo aventura</b>
                  <small>
                    Os mesmos temas viram missões, fases e desafios. A diversão não muda o padrão
                    das fontes.
                  </small>
                  <span className="welcome-choice-action">
                    Explorar jogando <ArrowRight size={15} aria-hidden="true" />
                  </span>
                </span>
              </button>
              <div className="welcome-path-shortcuts">
                <button
                  onClick={() => {
                    onClose();
                    onQuick();
                  }}
                >
                  <Compass size={15} aria-hidden="true" /> Sortear um artigo
                </button>
                <button
                  onClick={() => {
                    onClose();
                    onTour();
                  }}
                >
                  Fazer um tour pela Sala <ArrowRight size={15} aria-hidden="true" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <section className="welcome-support" aria-label="Opções de apoio e atendimento">
            <div className="welcome-gentle-message">
              <Heart size={20} aria-hidden="true" />
              <div>
                <b>Você não está só.</b>
                <p>
                  Esta é uma mensagem carinhosa de quem desenvolve a Sala: sentimos muito que este
                  momento esteja difícil. Você merece acolhimento e ajuda, sem julgamento.
                </p>
                <p>Se puder, converse com alguém de confiança e procure apoio profissional.</p>
              </div>
            </div>
            <div className="welcome-support-urgent">
              <b>Se houver perigo imediato</b>
              <p>
                Ligue para o SAMU pelo <a href="tel:192">192</a> ou procure uma UPA ou
                pronto-socorro.
              </p>
              <a
                href="https://www.gov.br/saude/pt-br/composicao/saes/samu-192/samu-192"
                target="_blank"
                rel="noopener noreferrer"
              >
                Informações oficiais sobre o SAMU 192 <ArrowRight size={14} aria-hidden="true" />
              </a>
            </div>
            <div className="welcome-support-resource">
              <b>Para conversar com alguém agora</b>
              <p>O CVV oferece apoio emocional gratuito pelo telefone 188, 24 horas por dia.</p>
              <a className="welcome-support-primary" href="tel:188">
                Ligar para o CVV · 188 <ArrowRight size={14} aria-hidden="true" />
              </a>
              <a href="https://cvv.org.br/ligue-188-3/" target="_blank" rel="noopener noreferrer">
                Ver outras formas oficiais de atendimento do CVV
              </a>
            </div>
            <div className="welcome-support-resource">
              <b>Para buscar cuidado profissional</b>
              <p>
                Uma Unidade Básica de Saúde (UBS) ou um CAPS da sua região pode acolher e orientar.
              </p>
              <a
                href="https://www.gov.br/saude/pt-br/composicao/saes/desmad/raps/caps/caps/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Como encontrar um CAPS <ArrowRight size={14} aria-hidden="true" />
              </a>
            </div>
            <p className="welcome-support-note">
              Você pode pausar, procurar alguém de confiança e voltar à Sala quando quiser.
            </p>
            <button className="welcome-check-in-skip" onClick={() => setStep('paths')}>
              Voltar à escolha do modo
            </button>
          </section>
        )}

        <div className="welcome-source-note">
          <BookOpen size={16} aria-hidden="true" />
          <span>
            <b>Conhecimento com contexto.</b> As referências são públicas e gratuitas. Confira os
            limites da verificação e consulte as fontes: acesso público não significa autorização
            para republicar o material.
          </span>
        </div>
        <p className="welcome-dialog-caveat">
          Os índices demonstrativos do catálogo não são uma auditoria editorial independente.
        </p>
        <p className="welcome-dialog-copyright">
          <strong>Sala de Calma e Estudo · © {new Date().getFullYear()}.</strong> Código sob MIT;
          textos originais sob CC BY 4.0. Conteúdos de terceiros seguem suas próprias licenças.
        </p>
      </section>
    </div>
  );
}
