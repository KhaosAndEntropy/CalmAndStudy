import { useEffect, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Compass,
  Gamepad2,
  Heart,
  Sparkles,
  X,
} from 'lucide-react';
import type { LearningMode } from '../preferences/learning-mode';

const warmupQuestions = [
  {
    prompt: 'Qual destes animais tem três corações?',
    options: ['Polvo', 'Beija-flor', 'Tartaruga'],
    correct: 'Polvo',
    recommendation: 'Biologia e vida marinha',
  },
  {
    prompt: 'Qual planeta gira com uma inclinação tão grande que parece rolar de lado?',
    options: ['Urano', 'Marte', 'Mercúrio'],
    correct: 'Urano',
    recommendation: 'Astronomia e planetas',
  },
  {
    prompt: 'Um mapa antigo pode contar uma história. O que vale conferir primeiro?',
    options: ['Quem o produziu e com quais dados', 'Só as cores', 'Se parece moderno'],
    correct: 'Quem o produziu e com quais dados',
    recommendation: 'História e leitura de fontes',
  },
];

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
  const [playing, setPlaying] = useState(false);
  const [step, setStep] = useState<'check-in' | 'paths' | 'support'>('check-in');
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState<string | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [seconds, setSeconds] = useState(30);
  const [timedMode, setTimedMode] = useState(false);
  const [timedOut, setTimedOut] = useState(false);
  const complete = questionIndex >= warmupQuestions.length;

  useEffect(() => {
    if (!playing || !timedMode || complete || answer) return;
    const timer = window.setInterval(() => setSeconds(value => Math.max(0, value - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [playing, timedMode, complete, answer]);

  useEffect(() => {
    if (seconds === 0 && timedMode && !answer) setTimedOut(true);
  }, [seconds, timedMode, answer]);

  const currentQuestion = warmupQuestions[questionIndex];
  const chooseAnswer = (choice: string) => {
    if (answer || timedOut || !currentQuestion) return;
    setAnswer(choice);
    if (choice === currentQuestion.correct) setCorrectCount(value => value + 1);
  };
  const nextQuestion = () => {
    setQuestionIndex(value => value + 1);
    setAnswer(null);
    setSeconds(30);
    setTimedOut(false);
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
        <div className="eyebrow">BOAS-VINDAS À CALM & STUDY</div>
        <h2 id="welcome-dialog-title">
          {playing
            ? 'Uma rodada leve para começar.'
            : step === 'check-in'
              ? 'Como você está chegando hoje?'
              : step === 'support'
                ? 'Você merece apoio de verdade.'
                : 'Que jeito de aprender combina com você agora?'}
        </h2>
        <p id="welcome-dialog-description">
          {playing
            ? 'Sem pressão e sem cronômetro ligado por padrão. Você pode pular a rodada quando quiser.'
            : step === 'check-in'
              ? 'A gente se importa com cada pessoa que chega à Calm & Study. Se quiser, conte como está; sua resposta não será salva nem enviada. Também pode pular.'
              : step === 'support'
                ? 'A Calm & Study não substitui ajuda profissional. Se algo estiver pesado, há pessoas e serviços preparados para conversar e cuidar de você.'
                : 'A Calm & Study reúne artigos, trilhas, tutoriais e fontes públicas. O conhecimento e os critérios de verificação são os mesmos nos dois caminhos.'}
        </p>
        {playing ? (
          <section className="welcome-warmup" aria-live="polite">
            {complete ? (
              <>
                <h3>
                  {correctCount === 3
                    ? 'Placar perfeito. A curiosidade está afiada!'
                    : 'Boa rodada. A curiosidade também cresce com as respostas.'}
                </h3>
                <p>
                  Você acertou {correctCount} de {warmupQuestions.length}. Uma sugestão para
                  começar: {warmupQuestions[Math.min(correctCount, 2)].recommendation}.
                </p>
                <p>
                  As respostas ficam só nesta tela e não são salvas nem usadas para criar um perfil.
                </p>
                <button className="primary" onClick={onClose}>
                  Abrir o Modo aventura <ArrowRight size={15} />
                </button>
              </>
            ) : (
              <>
                <h3>
                  Rodada {questionIndex + 1} de {warmupQuestions.length}
                </h3>
                <p>{currentQuestion.prompt}</p>
                <div className="welcome-warmup-options">
                  {currentQuestion.options.map(option => (
                    <button
                      key={option}
                      onClick={() => chooseAnswer(option)}
                      disabled={Boolean(answer) || timedOut}
                    >
                      {option}
                      {answer === option
                        ? option === currentQuestion.correct
                          ? ' ✓'
                          : ' — quase!'
                        : ''}
                    </button>
                  ))}
                </div>
                {answer && (
                  <p>
                    {answer === currentQuestion.correct
                      ? 'Acertou! Uma curiosidade que vale guardar.'
                      : `Resposta: ${currentQuestion.correct}. Uma boa curiosidade para guardar.`}
                  </p>
                )}
                {timedOut && (
                  <p>
                    O cronômetro venceu esta rodada. Sem pontos perdidos. A resposta era{' '}
                    {currentQuestion.correct}.
                  </p>
                )}
                {timedMode && <p>Tempo da rodada: {seconds}s</p>}
                {(answer || timedOut) && (
                  <button className="primary" onClick={nextQuestion}>
                    Próxima pergunta <ArrowRight size={15} />
                  </button>
                )}
                <button
                  className="welcome-warmup-toggle"
                  onClick={() => {
                    setTimedMode(value => !value);
                    setSeconds(30);
                  }}
                >
                  {timedMode ? 'Tirar o cronômetro' : 'Ativar desafio de 30 segundos'}
                </button>
                <p>Opcional. Sem cronômetro por padrão. Pode pular quando quiser.</p>
              </>
            )}
          </section>
        ) : step === 'check-in' ? (
          <section className="welcome-check-in" aria-label="Check-in opcional">
            <div className="welcome-check-in-options">
              <button onClick={() => setStep('paths')}>
                <span className="welcome-choice-icon">
                  <Sparkles size={18} aria-hidden="true" />
                </span>
                <span>
                  <b>Estou bem e quero explorar</b>
                  <small>Vamos encontrar uma curiosidade.</small>
                </span>
                <ArrowRight size={16} aria-hidden="true" />
              </button>
              <button onClick={() => setStep('paths')}>
                <span className="welcome-choice-icon">
                  <BookOpen size={18} aria-hidden="true" />
                </span>
                <span>
                  <b>Quero algo leve e tranquilo</b>
                  <small>Sem pressa e sem cobrança.</small>
                </span>
                <ArrowRight size={16} aria-hidden="true" />
              </button>
              <button onClick={() => setStep('support')}>
                <span className="welcome-choice-icon">
                  <Heart size={18} aria-hidden="true" />
                </span>
                <span>
                  <b>Estou passando por um momento difícil</b>
                  <small>Quero ver opções de apoio.</small>
                </span>
                <ArrowRight size={16} aria-hidden="true" />
              </button>
            </div>
            <button className="welcome-check-in-skip" onClick={() => setStep('paths')}>
              Prefiro não responder; quero escolher como aprender
              <ArrowRight size={15} aria-hidden="true" />
            </button>
            <p className="welcome-privacy-note">
              Isto não é uma avaliação de saúde. A resposta fica somente nesta tela e não muda o
              conteúdo, as recomendações nem o jeito como o site trata você.
            </p>
          </section>
        ) : step === 'support' ? (
          <section className="welcome-support" aria-label="Opções de apoio e atendimento">
            <div className="welcome-support-urgent">
              <b>Se você estiver em perigo imediato</b>
              <p>
                Ligue para o SAMU pelo <a href="tel:192">192</a> ou procure uma UPA ou
                pronto-socorro. O serviço é gratuito e atende urgências, inclusive tentativas de
                suicídio.
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
              <b>Se quiser conversar com alguém agora</b>
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
                Você pode procurar a Unidade Básica de Saúde (UBS) ou ir diretamente ao CAPS da sua
                região. As equipes podem acolher e orientar sobre o atendimento adequado.
              </p>
              <a
                href="https://www.gov.br/saude/pt-br/composicao/saes/desmad/raps/caps/caps/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Como encontrar e procurar um CAPS <ArrowRight size={14} aria-hidden="true" />
              </a>
            </div>
            <p className="welcome-support-note">
              Se puder, aproxime-se de alguém de confiança enquanto busca apoio. Você não precisa
              atravessar um momento difícil sem apoio. Pode continuar para a Calm & Study quando
              quiser; não há obrigação de responder ou ficar nesta tela.
            </p>
            <button className="primary" onClick={() => setStep('paths')}>
              Continuar para escolher meu ritmo <ArrowRight size={15} aria-hidden="true" />
            </button>
            <button className="welcome-check-in-skip" onClick={() => setStep('check-in')}>
              <ArrowLeft size={15} aria-hidden="true" /> Voltar
            </button>
          </section>
        ) : (
          <div className="welcome-choices">
            <button
              className="welcome-choice"
              onClick={() => {
                onModeSelect('calm');
                onClose();
              }}
            >
              <span className="welcome-choice-icon">
                <BookOpen size={19} aria-hidden="true" />
              </span>
              <span className="welcome-choice-copy">
                <b>Estudo calmo</b>
                <small>
                  Leituras, trilhas, fontes e tutoriais com uma apresentação discreta, humana e sem
                  pressão. Você escolhe por onde seguir.
                </small>
                <span className="welcome-choice-action">
                  Estudar com calma <ArrowRight size={15} />
                </span>
              </span>
            </button>
            <button
              className="welcome-choice"
              onClick={() => {
                onModeSelect('adventure');
                setPlaying(true);
              }}
            >
              <span className="welcome-choice-icon">
                <Gamepad2 size={19} aria-hidden="true" />
              </span>
              <span className="welcome-choice-copy">
                <b>Modo aventura</b>
                <small>
                  Transforme os mesmos temas em fases, missões e desafios. Sem perder o cuidado com
                  fontes e explicações.
                </small>
                <span className="welcome-choice-action">
                  Conhecer jogando <ArrowRight size={15} />
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
                Fazer um tour pela Calm & Study <ArrowRight size={15} aria-hidden="true" />
              </button>
            </div>
          </div>
        )}
        <div className="welcome-source-note">
          <BookOpen size={16} aria-hidden="true" />
          <span>
            <b>Conhecimento com contexto.</b> As referências são públicas e gratuitas. Conferimos
            procedência e acesso, e mostramos os limites dessas verificações para você poder ler e
            avaliar as fontes. Acesso público não significa autorização para republicar o material.
          </span>
        </div>
        <p className="welcome-dialog-caveat">
          Cada artigo lista referências para consulta. O catálogo inicial ainda está em revisão; os
          percentuais identificados como demonstrativos não representam uma auditoria editorial.
        </p>
        <p className="welcome-dialog-copyright">
          <strong>Calm & Study · © {new Date().getFullYear()}.</strong> Código sob MIT; textos
          originais de aprendizagem sob CC BY 4.0. Fontes, marcas e conteúdos de terceiros
          permanecem sujeitos às suas próprias licenças e atribuições.
        </p>
        <p className="welcome-dialog-revisit">
          Você pode trocar de ritmo a qualquer momento no menu do topo. As respostas deste check-in
          e da rodada inicial não são salvas.
        </p>
      </section>
    </div>
  );
}
