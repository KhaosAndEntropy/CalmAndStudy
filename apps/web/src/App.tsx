import {
  lazy,
  Suspense,
  startTransition,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
} from 'react';
import {
  AppearancePanel,
  type AppearancePreferenceKey,
} from './features/preferences/AppearancePanel';
import { type VerifiableSource } from './features/reader/ReaderSupport';
import { DiscoveryScreen } from './features/discovery/DiscoveryScreen';
import type { TopicSuggestion, TopicSuggestionDraft } from './features/suggestions/types';
import { postSubmission, SubmissionError } from '@calmandstudy/content/submissions';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  BarChart3,
  Bookmark,
  BookOpen,
  Check,
  Compass,
  Download,
  Gamepad2,
  GraduationCap,
  HeartHandshake,
  History,
  Lightbulb,
  Menu,
  Network,
  Newspaper,
  Search,
  Scale,
  Settings2,
  Shuffle,
  Sparkles,
  X,
} from 'lucide-react';
import {
  fields,
  studyPaths,
  suggestedNextTopicIds,
  topics,
  tutorials,
  validateEditorialRecord,
  type Tutorial,
} from '@calmandstudy/content';
import { expandedReading } from '@calmandstudy/content/expanded';
import type { Topic } from '@calmandstudy/content';
import { useStoredState } from './shared/hooks/useStoredState';
import { useAccessibleDialog } from './shared/hooks/useAccessibleDialog';
import { WelcomeDialog } from './features/welcome/WelcomeDialog';
import { LearningModePicker } from './features/preferences/LearningModePicker';
import {
  isLearningMode,
  learningModeStorageKey,
  type LearningMode,
} from './features/preferences/learning-mode';
import { WelcomeTour, type WelcomeTourStop } from './features/welcome/WelcomeTour';
import { InstallAppDialog } from './features/install/InstallAppDialog';
import { ContentPolicyPage } from './features/legal/ContentPolicyPage';
import { LibraryTopicCard } from './features/topics/LibraryTopicCard';
import './interaction.css';
import './features/map/knowledge-map.css';
import { useEngagement } from './features/engagement/useEngagement';

const PublicResearch = lazy(() => import('./PublicResearch'));
const ReaderDialog = lazy(() =>
  import('./features/reader/ReaderDialog').then(module => ({ default: module.ReaderDialog })),
);
const TutorialDialog = lazy(() =>
  import('./features/tutorials/TutorialDialog').then(module => ({
    default: module.TutorialDialog,
  })),
);
const SuggestionDialog = lazy(() =>
  import('./features/suggestions/SuggestionDialog').then(module => ({
    default: module.SuggestionDialog,
  })),
);
const GameModeScreen = lazy(() =>
  import('./features/game/GameModeScreen').then(module => ({ default: module.GameModeScreen })),
);
const StudyPathsScreen = lazy(() =>
  import('./features/trails/StudyPathsScreen').then(module => ({
    default: module.StudyPathsScreen,
  })),
);
const TutorialsScreen = lazy(() =>
  import('./features/tutorials/TutorialsScreen').then(module => ({
    default: module.TutorialsScreen,
  })),
);
const EngagementDashboard = lazy(() =>
  import('./features/engagement/EngagementDashboard').then(module => ({
    default: module.EngagementDashboard,
  })),
);
const KnowledgeMap = lazy(() =>
  import('./features/map/KnowledgeMap').then(module => ({ default: module.KnowledgeMap })),
);

function PageLoading() {
  return (
    <div className="page-loading" role="status" aria-live="polite">
      Abrindo esta área…
    </div>
  );
}

const releaseNotes = [
  [
    'Dois jeitos de aprender e uma pausa com carinho',
    'Escolha entre Estudo calmo e Modo aventura. O check-in é opcional, e um lembrete discreto pode sugerir uma pausa depois de um tempo de navegação ativa. As escolhas pessoais não são enviadas.',
  ],
  [
    'Agora é mais fácil participar da Calm & Study',
    'O projeto está aberto a contribuições educativas, correções e melhorias. Toda proposta é revisada antes de entrar no catálogo.',
  ],
  [
    'Mais clareza sobre fontes, imagens e licenças',
    'Uma nova página explica como consultar referências, entender ilustrações feitas com IA, reportar correções e respeitar as licenças de cada material.',
  ],
  [
    'Um banner mais realista para dar boas-vindas',
    'A página inicial agora recebe uma imagem fotográfica criada para a Calm & Study, com objetos de leitura e descoberta e uma área escura que preserva a leitura do texto.',
  ],
  [
    'As questões das trilhas voltaram a ficar alinhadas',
    'Corrigimos um estilo que estreitava o texto dos enunciados. As perguntas e alternativas agora se organizam sem cortes em telas pequenas.',
  ],
  [
    'Um mapa mais fácil de seguir',
    'O mapa agora apresenta cada assunto com suas bases, próximos passos e temas relacionados em blocos claros, que também funcionam bem no celular.',
  ],
  [
    'Cards e áreas com cores mais vivas',
    'Artigos, trilhas, tutoriais e outros cards usam a mesma elevação e uma sombra mais perceptível. Os selos das áreas têm cores próprias e o destaque acompanha a imagem quando disponível.',
  ],
  [
    'Mais referências para suas pesquisas',
    'A busca considera mais resultados antes de exibir aqueles que atendem aos critérios de acesso livre e leitura integral.',
  ],
  [
    'Tutoriais e trilhas mais fáceis de acompanhar',
    'Agora você pode buscar por assunto e filtrar por área nas duas seções. Os tutoriais têm capas fotográficas ilustrativas, permitem rever a etapa final e guardam um check no card quando você conclui cada atividade. A apresentação e o rodapé também identificam quem criou e desenvolveu a Calm & Study.',
  ],
  [
    'Mais fácil instalar e explorar o catálogo',
    'A opção para instalar a Calm & Study como app ficou mais clara, os artigos passaram a carregar em pequenos lotes e o atalho de sugestão sai da frente do link “Sobre a Calm & Study” quando você chega ao rodapé no celular.',
  ],
  [
    'A Calm & Study fica mais acessível',
    'Ficou mais confortável navegar pelo teclado, ampliar o conteúdo e usar os controles com tecnologias assistivas.',
  ],
  [
    'Uma apresentação para quem chega',
    'Na primeira visita, uma mensagem explica a proposta da Calm & Study, as formas de explorar os assuntos e como consultar as referências. Ela pode ser aberta novamente pelo link “Sobre a Calm & Study”, no rodapé.',
  ],
  [
    'Ilustrações para todos os artigos',
    'Os artigos atuais têm imagens ilustrativas criadas para cada tema. Elas ajudam a imaginar o assunto, mas não substituem evidências históricas ou científicas.',
  ],
  [
    'Uma voz e um resumo para cada leitura',
    'Agora você pode ouvir o artigo em português usando a voz disponível no seu navegador e terminar a leitura com uma síntese simples para guardar a ideia principal.',
  ],
  [
    'Leituras anteriores mais fáceis de encontrar',
    'O botão “Ler primeiro” ganhou contraste e um formato próprio para ficar legível em diferentes paletas e tamanhos de tela.',
  ],
  [
    'Áreas científicas mais fáceis de explorar',
    'As ciências agora aparecem em uma lista organizada, com pesquisa, contagem de artigos e indicação clara da área selecionada.',
  ],
  [
    'Mais caminhos para conectar os artigos',
    'As trilhas cobrem os artigos disponíveis, com sequências que ajudam a construir contexto. As conexões e os limites de cada percurso também ficam explicados.',
  ],
  [
    'Mais prática depois de cada leitura',
    'Os artigos ganharam exercícios curtos; cada trilha propõe uma atividade por tema e uma síntese final que percorre o caminho inteiro. A biblioteca de tutoriais também cresceu.',
  ],
  [
    'Fontes públicas, com transparência',
    'A Calm & Study explicita o compromisso de priorizar informações sustentadas por fontes públicas e rastreáveis. A checagem automática informa se um link respondeu; não comprova, sozinha, a qualidade da evidência nem a ausência de paywall.',
  ],
  [
    'Ícones para navegador e celular',
    'O site agora usa o símbolo da Calm & Study na aba do navegador e oferece ícones adequados para adicionar um atalho à tela inicial do celular.',
  ],
  [
    'O leitor mantém os controles sempre visíveis',
    'A barra de navegação e o botão de fechar ficam acima da imagem e acompanham a leitura sem serem encobertos pelo conteúdo.',
  ],
  [
    'Agradecimentos à comunidade',
    'Criamos um espaço para reconhecer quem ajuda com ideias e feedback. Os nomes só serão publicados com autorização.',
  ],
  [
    'Uma saída simples da biblioteca',
    'A tela de Salvos ganhou um botão para voltar às descobertas, e o botão voltar do celular agora navega entre as seções da Calm & Study.',
  ],
  [
    'Leitura mais suave e no seu ritmo',
    'O salvamento não interrompe mais o artigo. Se quiser, ative uma barra discreta que acompanha seu progresso nas preferências de aparência. O compartilhamento está marcado como “Em breve”.',
  ],
];
const ReleaseNotes = () => {
  const [page, setPage] = useState(1);
  const pageSize = 5;
  const pageCount = Math.ceil(releaseNotes.length / pageSize);
  const visibleNotes = releaseNotes.slice((page - 1) * pageSize, page * pageSize);
  return (
    <section className="updates-page" aria-labelledby="updates-title">
      <header className="updates-intro">
        <div className="eyebrow">
          <Newspaper size={14} aria-hidden="true" /> NOVIDADES DA CALM & STUDY
        </div>
        <h1 id="updates-title">Novidades por aqui.</h1>
        <p>
          Um registro simples das melhorias que chegam para deixar o estudo mais claro, confortável
          e acessível.
        </p>
      </header>
      <div className="updates-list" aria-label="Histórico de melhorias">
        {visibleNotes.map(([title, description], index) => (
          <article className="update-note" key={title}>
            <span className="update-index" aria-hidden="true">
              {String((page - 1) * pageSize + index + 1).padStart(2, '0')}
            </span>
            <div>
              <time
                dateTime={
                  (page - 1) * pageSize + index === 0
                    ? '2026-11-14'
                    : (page - 1) * pageSize + index < 7
                      ? '2026-11-13'
                      : '2026-11-11'
                }
              >
                {(page - 1) * pageSize + index === 0
                  ? '14 de novembro de 2026'
                  : (page - 1) * pageSize + index < 7
                    ? '13 de novembro de 2026'
                    : '11 de novembro de 2026'}
              </time>
              <h2>{title}</h2>
              <p>{description}</p>
            </div>
          </article>
        ))}
      </div>
      <nav className="updates-pagination" aria-label="Paginação das novidades">
        <span>
          Mostrando {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, releaseNotes.length)} de{' '}
          {releaseNotes.length}
        </span>
        <div>
          <button
            className="outline-btn"
            onClick={() => setPage(current => Math.max(1, current - 1))}
            disabled={page === 1}
            aria-label="Página anterior"
          >
            Anterior
          </button>
          <span aria-live="polite">
            {page} / {pageCount}
          </span>
          <button
            className="outline-btn"
            onClick={() => setPage(current => Math.min(pageCount, current + 1))}
            disabled={page === pageCount}
            aria-label="Próxima página"
          >
            Próxima
          </button>
        </div>
      </nav>
    </section>
  );
};

const acknowledgements: { id: string; name: string; contribution?: string }[] = [];

const AcknowledgementsPage = () => (
  <section className="updates-page acknowledgements-page" aria-labelledby="acknowledgements-title">
    <header className="updates-intro">
      <div className="eyebrow">
        <HeartHandshake size={14} aria-hidden="true" /> COM A AJUDA DE QUEM USA
      </div>
      <h1 id="acknowledgements-title">A Calm & Study cresce em comunidade.</h1>
      <p>
        Um espaço para reconhecer as pessoas que ajudam a melhorar o produto com ideias, observações
        e feedbacks.
      </p>
    </header>
    {acknowledgements.length > 0 ? (
      <section className="acknowledgements-list" aria-label="Pessoas agradecidas">
        {acknowledgements.map(person => (
          <article className="acknowledgement-card" key={person.id}>
            <HeartHandshake size={18} aria-hidden="true" />
            <div>
              <h2>{person.name}</h2>
              {person.contribution && <p>{person.contribution}</p>}
            </div>
          </article>
        ))}
      </section>
    ) : (
      <section className="acknowledgements-empty">
        <span className="acknowledgements-mark">
          <HeartHandshake size={22} aria-hidden="true" />
        </span>
        <h2>Obrigado a quem compartilha feedback.</h2>
        <p>Suas observações ajudam a deixar a Calm & Study mais clara, útil e acolhedora.</p>
        <small>
          Os nomes aparecerão aqui somente com autorização. Ainda não há pessoas listadas.
        </small>
      </section>
    )}
  </section>
);

function isStringList(value: unknown): value is string[] {
  return (
    Array.isArray(value) &&
    value.length <= 500 &&
    value.every(item => typeof item === 'string' && item.length <= 120)
  );
}

function isTutorialProgress(value: unknown): value is Record<string, number[]> {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value) &&
    Object.values(value).length <= 100 &&
    Object.values(value).every(
      steps =>
        Array.isArray(steps) &&
        steps.length <= 200 &&
        steps.every(step => Number.isInteger(step) && step >= 0),
    )
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isSuggestionList(value: unknown): value is TopicSuggestion[] {
  return (
    Array.isArray(value) &&
    value.length <= 500 &&
    value.every((item: unknown) => {
      if (!isRecord(item)) return false;
      return (
        typeof item.id === 'string' &&
        typeof item.title === 'string' &&
        typeof item.field === 'string' &&
        typeof item.reason === 'string' &&
        typeof item.source === 'string' &&
        (item.sources === undefined ||
          (Array.isArray(item.sources) &&
            item.sources.length <= 3 &&
            item.sources.every(
              (source: unknown) =>
                isRecord(source) &&
                typeof source.publisher === 'string' &&
                typeof source.url === 'string',
            ))) &&
        (item.kind === 'topic' || item.kind === 'review') &&
        typeof item.createdAt === 'string' &&
        item.status === 'pending'
      );
    })
  );
}

function oneOf(...allowed: string[]) {
  return (value: unknown): value is string => typeof value === 'string' && allowed.includes(value);
}

const isPalette = oneOf('sage', 'lavender', 'ocean', 'peach', 'night');
const isLayout = oneOf('comfortable', 'compact', 'visual');
const isFont = oneOf('sans', 'serif', 'rounded');
const isFontSize = oneOf('small', 'normal', 'large');
const isBoolean = (value: unknown): value is boolean => typeof value === 'boolean';
const welcomeStorageKey = 'calmandstudy-welcome-seen-v2';
const welcomeTourStops: WelcomeTourStop[] = [
  {
    section: 'Navegação',
    title: 'Este é o mapa da Calm & Study',
    description:
      'Use o menu para alternar entre descobertas, pesquisa, trilhas, tutoriais e outras áreas. O passeio vai visitar cada uma delas.',
    target: '.sidebar nav',
    targetMobile: '#mobile-menu-toggle',
  },
  {
    section: 'Jornada',
    title: 'Transforme leitura em desafio',
    description:
      'Escolha uma jornada de artigos, trilhas ou tutoriais. Cada fase usa questões do próprio conteúdo; quatro acertos em cinco liberam a próxima.',
    target: '.game-tracks',
  },
  {
    section: 'Descobrir',
    title: 'Uma curiosidade em poucos minutos',
    description:
      'Este botão sorteia um artigo para você aprender algo rápido e levar uma curiosidade para a conversa.',
    target: '.welcome-actions .primary',
  },
  {
    section: 'Descobrir',
    title: 'Busque um assunto',
    description: 'Digite uma palavra ou pergunta para encontrar artigos relacionados no catálogo.',
    target: '#science-filters .search-box',
  },
  {
    section: 'Descobrir',
    title: 'Escolha entre as áreas',
    description:
      'Abra o seletor para filtrar por uma das áreas disponíveis. Você também pode voltar a ver tudo quando quiser.',
    target: '.area-toggle',
  },
  {
    section: 'Descobrir',
    title: 'Artigos para abrir e explorar',
    description:
      'Os cards resumem o assunto e indicam o tempo de leitura. Vamos abrir um exemplo para mostrar o restante da experiência.',
    target: '.discovery-grid .topic-card',
  },
  {
    section: 'Artigo',
    title: 'Leia, ouça e confira as fontes',
    description:
      'No artigo você encontra o conteúdo completo, referências e recursos para acompanhar ou ouvir a leitura.',
    target: '.reader-body',
    action: 'article',
  },
  {
    section: 'Artigo',
    title: 'Confira o que ficou',
    description:
      'Cada artigo termina com cinco questões de múltipla escolha. Ao responder, você recebe uma nota e explicações.',
    target: '.reader-body .knowledge-assessment-heading',
    action: 'articleQuiz',
  },
  {
    section: 'Trilhas de estudo',
    title: 'Construa conhecimento em sequência',
    description:
      'As trilhas conectam artigos numa ordem sugerida. Você continua livre para abrir qualquer etapa.',
    target: '.trail-grid .trail-card',
  },
  {
    section: 'Trilhas de estudo',
    title: 'Pratique os temas da trilha',
    description:
      'Cada trilha reúne exercícios relacionados aos artigos e uma prova para revisar o conjunto.',
    target: '.trail-grid .assessment-disclosure summary',
  },
  {
    section: 'Tutoriais',
    title: 'Aprenda fazendo',
    description: 'Escolha uma atividade guiada, acompanhe as etapas e marque o que já concluiu.',
    target: '.tutorial-grid .tutorial-card',
  },
  {
    section: 'Tutoriais',
    title: 'Acompanhe as etapas',
    description:
      'O tutorial organiza uma tarefa em passos curtos. Você pode avançar, voltar e retomá-lo depois.',
    target: '.tutorial-dialog .tutorial-steps-list',
    action: 'tutorial',
  },
  {
    section: 'Tutoriais',
    title: 'Finalize com uma revisão',
    description:
      'Ao concluir as etapas, aparece uma prova de cinco perguntas com nota e comentários para revisar o aprendizado.',
    target: '.tutorial-dialog .knowledge-assessment-heading',
    action: 'tutorialQuiz',
  },
  {
    section: 'Pesquisar fontes',
    title: 'Investigue nas fontes públicas',
    description:
      'Pesquise catálogos e bases de acesso aberto. Os resultados passam por filtros de acesso e procedência; consulte sempre o registro original.',
    target: '.public-research .research-search',
  },
  {
    section: 'Salvos',
    title: 'Guarde o que quer rever',
    description:
      'Use o marcador nos artigos para montar sua biblioteca pessoal e voltar às leituras depois.',
    target: '.saved-welcome',
  },
  {
    section: 'Estatísticas',
    title: 'Veja o que está em destaque',
    description:
      'Acompanhe os conteúdos mais lidos e curtidos pela comunidade. Os indicadores ajudam a encontrar assuntos populares.',
    target: '.engagement-summary',
  },
  {
    section: 'Novidades',
    title: 'Acompanhe as melhorias',
    description: 'Esta seção reúne as mudanças e atualizações feitas na Calm & Study.',
    target: '.updates-list',
  },
  {
    section: 'Agradecimentos',
    title: 'Reconheça quem contribui',
    description:
      'Aqui ficam os nomes das pessoas que compartilharam feedback e ajudaram a melhorar o projeto.',
    target: '.acknowledgements-list, .acknowledgements-empty',
  },
  {
    section: 'Direitos e transparência',
    title: 'Entenda fontes, imagens e licenças',
    description:
      'Veja como a Calm & Study diferencia referências, conteúdo editorial, ilustrações de IA e direitos de reutilização.',
    target: '.content-policy-page',
  },
  {
    section: 'Aparência',
    title: 'Ajuste o espaço ao seu gosto',
    description:
      'Escolha paleta, layout, família e tamanho da fonte. Você também pode ligar o indicador de progresso de leitura.',
    target: '#appearance-panel .pref-group',
    action: 'appearance',
  },
  {
    section: 'Instalação',
    title: 'Leve a Calm & Study para a tela inicial',
    description:
      'A versão web pode ser instalada como PWA pelo navegador. As instruções variam um pouco entre celular e computador.',
    target: '.install-dialog',
    action: 'install',
  },
  {
    section: 'Participação',
    title: 'Sugira um próximo assunto',
    description:
      'Proponha um tema ou uma revisão. A sugestão segue para análise e não é publicada automaticamente.',
    target: '.suggestion-form',
    action: 'suggestion',
  },
];
function sharedArticleFromUrl(): Topic | null {
  const id = new URLSearchParams(window.location.search).get('artigo');
  return id ? (topics.find(topic => topic.id === id) ?? null) : null;
}
function initialLearningSection(): string {
  if (sharedArticleFromUrl()) return 'Descobrir';
  try {
    return window.localStorage.getItem(learningModeStorageKey) === 'adventure'
      ? 'Jornada'
      : 'Descobrir';
  } catch {
    return 'Descobrir';
  }
}
type InstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform?: string }>;
};

export default function App() {
  const footerRef = useRef<HTMLElement | null>(null);
  const [footerVisible, setFooterVisible] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [installDialogOpen, setInstallDialogOpen] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<InstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [welcomeOpen, setWelcomeOpen] = useState(() => {
    if (sharedArticleFromUrl()) return false;
    try {
      return window.localStorage.getItem(welcomeStorageKey) !== 'true';
    } catch {
      return true;
    }
  });
  const [welcomeTourIndex, setWelcomeTourIndex] = useState<number | null>(null);
  const [active, setActive] = useState(initialLearningSection);
  const [learningMode, setLearningMode] = useStoredState<LearningMode>(
    learningModeStorageKey,
    'calm',
    isLearningMode,
  );
  const [showPauseReminder, setShowPauseReminder] = useState(false);
  const activeSecondsRef = useRef(0);
  const pauseReminderControlRef = useRef({ dismissed: false, shown: false, snoozeUntil: 0 });
  const engagement = useEngagement();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selected, setSelected] = useState<Topic | null>(() => sharedArticleFromUrl());
  const [selectedTutorial, setSelectedTutorial] = useState<Tutorial | null>(null);
  const [tutorialStep, setTutorialStep] = useState(0);
  const [suggestionOpen, setSuggestionOpen] = useState(false);
  const [suggestionDraft, setSuggestionDraft] = useState<TopicSuggestionDraft>({
    title: '',
    field: '',
    reason: '',
    source: '',
    sources: Array.from({ length: 3 }, () => ({ publisher: '', url: '' })),
    kind: 'topic',
  });
  const [suggestions, setSuggestions] = useStoredState<TopicSuggestion[]>(
    'calmandstudy-topic-suggestions',
    [],
    isSuggestionList,
  );
  const [submittingSuggestion, setSubmittingSuggestion] = useState(false);
  const [submissionMessage, setSubmissionMessage] = useState('');
  const [tutorialProgress, setTutorialProgress] = useStoredState<Record<string, number[]>>(
    'calmandstudy-tutorial-progress',
    {},
    isTutorialProgress,
  );
  const [completedTutorials, setCompletedTutorials] = useStoredState<string[]>(
    'calmandstudy-completed-tutorials',
    [],
    isStringList,
  );
  const [field, setField] = useState('Todas');
  const [query, setQuery] = useState('');
  const [saved, setSaved] = useStoredState<string[]>('calmandstudy-saved-topics', [], isStringList);
  const [readTopics, setReadTopics] = useStoredState<string[]>(
    'calmandstudy-read-topics-v1',
    [],
    isStringList,
  );
  const [toast, setToast] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [fieldQuery, setFieldQuery] = useState('');
  const [showAppearance, setShowAppearance] = useState(false);
  const [palette, setPalette] = useStoredState('calmandstudy-palette', 'sage', isPalette);
  const [layout, setLayout] = useStoredState('calmandstudy-layout', 'comfortable', isLayout);
  const [font, setFont] = useStoredState('calmandstudy-font', 'sans', isFont);
  const [fontSize, setFontSize] = useStoredState('calmandstudy-fontSize', 'normal', isFontSize);
  const [readingProgress, setReadingProgress] = useStoredState(
    'calmandstudy-reading-progress',
    false,
    isBoolean,
  );
  useEffect(() => {
    const timer = window.setInterval(() => {
      if (document.visibilityState !== 'visible') return;
      activeSecondsRef.current += 1;
      const elapsed = activeSecondsRef.current;
      const reminder = pauseReminderControlRef.current;
      if (
        !reminder.dismissed &&
        !reminder.shown &&
        elapsed >= 30 * 60 &&
        elapsed >= reminder.snoozeUntil
      ) {
        reminder.shown = true;
        setShowPauseReminder(true);
      }
    }, 1000);
    return () => window.clearInterval(timer);
  }, []);
  useEffect(() => {
    const onBeforeInstall = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as InstallPromptEvent);
    };
    const onInstalled = () => {
      setIsInstalled(true);
      setInstallPrompt(null);
    };
    let backToTopVisible = false;
    const updateBackToTop = () => {
      const shouldShow = window.scrollY > 900;
      if (shouldShow !== backToTopVisible) {
        backToTopVisible = shouldShow;
        setShowBackToTop(shouldShow);
      }
    };
    updateBackToTop();
    window.addEventListener('scroll', updateBackToTop, { passive: true });
    const standaloneNavigator = window.navigator as Navigator & { standalone?: boolean };
    setIsInstalled(
      window.matchMedia('(display-mode: standalone)').matches ||
        standaloneNavigator.standalone === true,
    );
    window.addEventListener('beforeinstallprompt', onBeforeInstall);
    window.addEventListener('appinstalled', onInstalled);
    const footer = footerRef.current;
    const observer =
      footer && 'IntersectionObserver' in window
        ? new IntersectionObserver(([entry]) => setFooterVisible(entry.isIntersecting), {
            threshold: 0,
          })
        : null;
    if (footer && observer) observer.observe(footer);
    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstall);
      window.removeEventListener('appinstalled', onInstalled);
      window.removeEventListener('scroll', updateBackToTop);
      observer?.disconnect();
    };
  }, []);
  useEffect(() => {
    if (!window.history.state?.calmandstudyApp)
      window.history.replaceState(
        { calmandstudyApp: true, calmandstudySection: 'Descobrir' },
        '',
        window.location.href,
      );
    const onPopState = (event: PopStateEvent) => {
      setSelected(null);
      setSelectedTutorial(null);
      setMobileMenuOpen(false);
      setActive(
        typeof event.state?.calmandstudySection === 'string'
          ? event.state.calmandstudySection
          : 'Descobrir',
      );
      if (!event.state?.calmandstudyApp)
        window.history.replaceState(
          { calmandstudyApp: true, calmandstudySection: 'Descobrir' },
          '',
          window.location.href,
        );
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);
  const applyPreference = (key: AppearancePreferenceKey, value: string) => {
    const setters: Partial<Record<AppearancePreferenceKey, (value: string) => void>> = {
      palette: setPalette,
      layout: setLayout,
      font: setFont,
      fontSize: setFontSize,
      readingProgress: value => setReadingProgress(value === 'true'),
    };
    setters[key]?.(value);
  };
  const matching = useMemo(
    () =>
      topics.filter(
        t =>
          (field === 'Todas' ||
            t.field === field ||
            t.tags.some(tag => tag.toLowerCase().includes(field.toLowerCase()))) &&
          (t.title.toLowerCase().includes(query.toLowerCase()) ||
            t.summary.toLowerCase().includes(query.toLowerCase()) ||
            t.tags.some(tag => tag.includes(query.toLowerCase()))),
      ),
    [field, query],
  );
  const matchingFields = useMemo(
    () => fields.filter(item => item.toLowerCase().includes(fieldQuery.toLowerCase())),
    [fieldQuery],
  );
  const countInField = (selectedField: string) =>
    selectedField === 'Todas'
      ? topics.length
      : topics.filter(
          t =>
            t.field === selectedField ||
            t.tags.some(tag => tag.toLowerCase().includes(selectedField.toLowerCase())),
        ).length;
  const current = selected ?? topics[0];
  useEffect(() => {
    if (selected) engagement.trackRead('article', selected.id);
  }, [selected, engagement.trackRead]);
  const sourceCandidates = useMemo<VerifiableSource[]>(() => {
    const evidencedSourceIds = new Set(
      current.editorial?.claims.flatMap(claim =>
        claim.evidence.map(evidence => evidence.sourceId),
      ) ?? [],
    );
    return current.editorial?.status === 'published' &&
      validateEditorialRecord(current.editorial).length === 0
      ? current.editorial.sources
          .filter(source => evidencedSourceIds.has(source.id))
          .map(source => ({
            name: `${source.title} · ${source.publisher}`,
            url: source.url,
            kind: source.kind,
          }))
      : [];
  }, [current]);
  const notify = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(''), 2400);
  };
  const random = useCallback(() => {
    const options = matching.length ? matching : topics;
    const next = options[Math.floor(Math.random() * options.length)];
    setSelected(next);
    setActive('Descobrir');
  }, [matching]);
  const randomTutorial = () => {
    const next = tutorials[Math.floor(Math.random() * tutorials.length)];
    setTutorialStep(0);
    setSelectedTutorial(next);
    engagement.trackRead('tutorial', next.id);
    setActive('Tutoriais');
  };
  const explainSubmissionError = (error: unknown) => {
    if (error instanceof SubmissionError) {
      const retryAt = error.retryAt
        ? ` Você poderá reenviar após ${new Date(error.retryAt).toLocaleString('pt-BR')}.`
        : '';
      return `${error.message}${retryAt}`;
    }
    return 'Não foi possível enviar. A sugestão foi mantida neste dispositivo e pode ser reenviada depois.';
  };
  const submitOneSuggestion = (item: TopicSuggestion) =>
    postSubmission('/api/submissions', {
      id: item.id,
      kind: item.kind,
      payload: {
        title: item.title,
        field: item.field,
        reason: item.reason,
        source: item.source,
        sources: item.sources,
        editorialPolicyAccepted: item.kind === 'topic' ? true : undefined,
        articleId: item.articleId,
        articleTitle: item.articleTitle,
      },
    });
  const saveSuggestion = async (event: FormEvent) => {
    event.preventDefault();
    const item: TopicSuggestion = {
      ...suggestionDraft,
      editorialPolicyAccepted: suggestionDraft.kind === 'topic',
      title:
        suggestionDraft.kind === 'review'
          ? `Revisão: ${suggestionDraft.articleTitle}`
          : suggestionDraft.title.trim(),
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      status: 'pending',
    };
    setSuggestions(current =>
      [item, ...current.filter(existing => existing.id !== item.id)].slice(0, 100),
    );
    setSubmittingSuggestion(true);
    setSubmissionMessage('');
    try {
      await submitOneSuggestion(item);
      setSuggestions(current => current.filter(pending => pending.id !== item.id));
      setSuggestionDraft({
        title: '',
        field: '',
        reason: '',
        source: '',
        sources: Array.from({ length: 3 }, () => ({ publisher: '', url: '' })),
        kind: 'topic',
      });
      setSuggestionOpen(false);
      notify('Recebemos sua sugestão. Ela aguardará revisão editorial.');
    } catch (error) {
      setSubmissionMessage(explainSubmissionError(error));
      setSuggestionDraft({
        title: '',
        field: '',
        reason: '',
        source: '',
        sources: Array.from({ length: 3 }, () => ({ publisher: '', url: '' })),
        kind: 'topic',
      });
    } finally {
      setSubmittingSuggestion(false);
    }
  };
  const retrySuggestions = async () => {
    if (submittingSuggestion || !suggestions.length) return;
    setSubmittingSuggestion(true);
    setSubmissionMessage('');
    const sentIds: string[] = [];
    try {
      for (const item of suggestions) {
        await submitOneSuggestion(item);
        sentIds.push(item.id);
      }
      setSubmissionMessage(`${sentIds.length} sugestão(ões) enviada(s) para revisão.`);
    } catch (error) {
      setSubmissionMessage(explainSubmissionError(error));
    } finally {
      if (sentIds.length)
        setSuggestions(current => current.filter(item => !sentIds.includes(item.id)));
      setSubmittingSuggestion(false);
    }
  };
  const openSuggestion = () => {
    setSubmissionMessage('');
    setSuggestionOpen(true);
  };
  const openInstallDialog = () => {
    setMobileMenuOpen(false);
    setInstallDialogOpen(true);
  };
  const installApp = async () => {
    if (!installPrompt) return;
    try {
      await installPrompt.prompt();
      const choice = await installPrompt.userChoice;
      setInstallPrompt(null);
      if (choice.outcome === 'accepted') setIsInstalled(true);
    } catch {
      setInstallPrompt(null);
    }
  };
  const suggestMissingTopic = () => {
    setSuggestionDraft({
      title: query.trim(),
      field: field === 'Todas' ? '' : field,
      reason: '',
      source: '',
      sources: Array.from({ length: 3 }, () => ({ publisher: '', url: '' })),
      kind: 'topic',
    });
    openSuggestion();
  };
  const closeWelcome = () => {
    setWelcomeOpen(false);
    try {
      window.localStorage.setItem(welcomeStorageKey, 'true');
    } catch {
      /* A apresentação pode ser fechada mesmo sem armazenamento local. */
    }
  };
  const toggleTutorialStep = (tutorialId: string, index: number) =>
    setTutorialProgress(current => {
      const steps = current[tutorialId] ?? [];
      return {
        ...current,
        [tutorialId]: steps.includes(index)
          ? steps.filter(step => step !== index)
          : [...steps, index],
      };
    });
  const finishTutorial = (tutorialId: string) => {
    setCompletedTutorials(current =>
      current.includes(tutorialId) ? current : [...current, tutorialId],
    );
    setSelectedTutorial(null);
    notify('Tutorial concluído e salvo neste dispositivo.');
  };
  const toggleSaved = useCallback(
    (id: string) =>
      startTransition(() => setSaved(s => (s.includes(id) ? s.filter(x => x !== id) : [...s, id]))),
    [setSaved],
  );
  const toggleRead = useCallback(
    (id: string) =>
      setReadTopics(current =>
        current.includes(id) ? current.filter(item => item !== id) : [...current, id],
      ),
    [setReadTopics],
  );
  const closeScienceFilters = useCallback(() => setShowFilters(false), []);
  const closeReader = useCallback(() => {
    setSelected(null);
    const url = new URL(window.location.href);
    if (url.searchParams.has('artigo')) {
      url.searchParams.delete('artigo');
      window.history.replaceState(
        window.history.state,
        '',
        `${url.pathname}${url.search}${url.hash}`,
      );
    }
  }, []);
  const toggleCurrentSaved = useCallback(() => toggleSaved(current.id), [current.id, toggleSaved]);
  const reviewTopic = useCallback((topic: Topic) => {
    setSuggestionDraft({
      title: `Revisão: ${topic.title}`,
      field: topic.field,
      reason: '',
      source: '',
      sources: Array.from({ length: 3 }, () => ({ publisher: '', url: '' })),
      kind: 'review',
      articleId: topic.id,
      articleTitle: topic.title,
    });
    setSubmissionMessage('');
    setSuggestionOpen(true);
  }, []);
  const selectSection = (label: string) => {
    if (label !== active)
      window.history.pushState(
        { calmandstudyApp: true, calmandstudySection: label },
        '',
        window.location.href,
      );
    setActive(label);
    if (label === 'Jornada') setLearningMode('adventure');
    setMobileMenuOpen(false);
    window.requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: 'instant' });
      document.getElementById('conteudo')?.focus({ preventScroll: true });
    });
  };
  const changeLearningMode = (mode: LearningMode) => {
    setLearningMode(mode);
    setSelected(null);
    setSelectedTutorial(null);
    setMobileMenuOpen(false);
    const destination = mode === 'calm' ? 'Descobrir' : 'Jornada';
    if (destination !== active) {
      window.history.pushState(
        { calmandstudyApp: true, calmandstudySection: destination },
        '',
        window.location.href,
      );
    }
    setActive(destination);
    window.requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  };
  const setTourSection = (label: string) => {
    setActive(label);
    setMobileMenuOpen(false);
    window.history.replaceState(
      { calmandstudyApp: true, calmandstudySection: label },
      '',
      window.location.href,
    );
  };
  const prepareWelcomeTourStop = (index: number) => {
    const stop = welcomeTourStops[index];
    if (!stop) return;
    const section = ['Navegação', 'Aparência', 'Instalação', 'Participação'].includes(stop.section)
      ? 'Descobrir'
      : stop.section;
    setTourSection(section);
    setSelected(null);
    setSelectedTutorial(null);
    setSuggestionOpen(false);
    setInstallDialogOpen(false);
    setShowAppearance(false);
    switch (stop.action) {
      case 'article':
      case 'articleQuiz':
        setSelected(topics[0] ?? null);
        break;
      case 'tutorial':
      case 'tutorialQuiz': {
        const tutorial = tutorials[0];
        if (tutorial) {
          setTutorialStep(stop.action === 'tutorialQuiz' ? tutorial.steps.length : 0);
          setSelectedTutorial(tutorial);
        }
        break;
      }
      case 'appearance':
        setShowAppearance(true);
        break;
      case 'install':
        setInstallDialogOpen(true);
        break;
      case 'suggestion':
        setSuggestionOpen(true);
        break;
    }
  };
  const startWelcomeTour = () => {
    closeWelcome();
    setWelcomeTourIndex(0);
    prepareWelcomeTourStop(0);
  };
  const moveWelcomeTour = (direction: -1 | 1) => {
    if (welcomeTourIndex === null) return;
    const next = welcomeTourIndex + direction;
    if (next < 0) return;
    if (next >= welcomeTourStops.length) {
      setWelcomeTourIndex(null);
      return;
    }
    setWelcomeTourIndex(next);
    prepareWelcomeTourStop(next);
  };
  const returnToDiscover = () => {
    if (active === 'Salvos' && window.history.state?.calmandstudyApp && window.history.length > 1)
      window.history.back();
    else selectSection('Descobrir');
  };
  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    window.requestAnimationFrame(() => document.getElementById('mobile-menu-toggle')?.focus());
  };
  const focusSearch = () => {
    setActive('Descobrir');
    window.requestAnimationFrame(() => document.getElementById('search')?.focus());
  };
  useEffect(() => {
    if (!mobileMenuOpen) return;
    const aside = document.querySelector<HTMLElement>('.sidebar');
    const main = document.getElementById('conteudo');
    const previousInert = main?.inert ?? false;
    const previousAriaHidden = main?.getAttribute('aria-hidden') ?? null;
    const isMobile = window.matchMedia('(max-width: 720px)').matches;
    if (isMobile && main) {
      main.inert = true;
      main.setAttribute('aria-hidden', 'true');
    }
    if (isMobile)
      window.requestAnimationFrame(() => aside?.querySelector<HTMLElement>('.brand')?.focus());
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMobileMenuOpen(false);
        window.requestAnimationFrame(() => document.getElementById('mobile-menu-toggle')?.focus());
      } else if (isMobile && event.key === 'Tab' && aside) {
        const focusable = [
          ...aside.querySelectorAll<HTMLElement>('a[href], button:not([disabled])'),
        ].filter(element => element.getClientRects().length > 0);
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }
    };
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('keydown', closeOnEscape);
      if (isMobile && main) {
        main.inert = previousInert;
        if (previousAriaHidden === null) main.removeAttribute('aria-hidden');
        else main.setAttribute('aria-hidden', previousAriaHidden);
      }
    };
  }, [mobileMenuOpen]);
  const activeDialogTitle = welcomeOpen
    ? 'Conheça a proposta da Calm & Study'
    : welcomeTourIndex !== null
      ? 'Tour interativo da Calm & Study'
      : installDialogOpen
        ? 'Instale a Calm & Study no seu dispositivo'
        : suggestionOpen
          ? suggestionDraft.kind === 'review'
            ? 'Sugerir revisão do artigo'
            : 'Sugira um próximo tema'
          : (selectedTutorial?.title ?? selected?.title ?? '');
  useAccessibleDialog(Boolean(activeDialogTitle), activeDialogTitle, () => {
    if (welcomeOpen) closeWelcome();
    else if (welcomeTourIndex !== null) setWelcomeTourIndex(null);
    else if (installDialogOpen) setInstallDialogOpen(false);
    else if (suggestionOpen) setSuggestionOpen(false);
    else if (selectedTutorial) setSelectedTutorial(null);
    else setSelected(null);
  });

  return (
    <div
      className={`shell palette-${palette} layout-${layout} type-${font} size-${fontSize} mode-${learningMode}${welcomeTourIndex !== null ? ' tour-mode' : ''}`}
    >
      <a className="skip-link" href="#conteudo">
        Pular para o conteúdo principal
      </a>
      <aside
        className={`sidebar ${mobileMenuOpen ? 'sidebar-open' : ''}`}
        aria-label="Menu principal"
      >
        <button
          className="sidebar-close"
          aria-label="Fechar menu principal"
          onClick={closeMobileMenu}
        >
          <X size={19} aria-hidden="true" />
        </button>
        <a
          className="brand"
          href="#conteudo"
          aria-label="Calm & Study, ir para a página inicial"
          onClick={() => {
            setActive('Descobrir');
            setSelected(null);
            setMobileMenuOpen(false);
          }}
        >
          <span className="brand-mark">
            <Sparkles size={19} aria-hidden="true" />
          </span>
          <span aria-hidden="true">
            calmandstudy<span className="brand-dot">.</span>
          </span>
        </a>
        <nav id="main-navigation" aria-label="Navegação principal">
          {[
            {
              title: 'APRENDER',
              items: [
                ['Descobrir', Compass],
                ['Trilhas de estudo', History],
                ['Tutoriais', GraduationCap],
                ['Jornada', Gamepad2],
              ],
            },
            {
              title: 'EXPLORAR',
              items: [
                ['Mapa de assuntos', Network],
                ['Pesquisar fontes', BookOpen],
                ['Estatísticas', BarChart3],
              ],
            },
            { title: 'MINHA BIBLIOTECA', items: [['Salvos', Bookmark]] },
            {
              title: 'SOBRE O PROJETO',
              items: [
                ['Novidades', Newspaper],
                ['Agradecimentos', HeartHandshake],
                ['Direitos e transparência', Scale],
              ],
            },
          ].map(group => (
            <section className="nav-group" key={group.title} aria-label={group.title}>
              <div className="side-label">{group.title}</div>
              {group.items.map(([label, Icon]: any) => (
                <button
                  key={label}
                  className={`nav-item ${active === label ? 'active' : ''}`}
                  aria-current={active === label ? 'page' : undefined}
                  onClick={() => selectSection(label)}
                >
                  <Icon size={18} aria-hidden="true" />
                  {label}
                  {label === 'Salvos' && saved.length > 0 && (
                    <span className="count" aria-label={`${saved.length} itens salvos`}>
                      {saved.length}
                    </span>
                  )}
                </button>
              ))}
            </section>
          ))}
          <section className="nav-group nav-tools" aria-label="Acesso rápido">
            <div className="side-label">ACESSO RÁPIDO</div>
            <button className="nav-item install-nav-item" onClick={openInstallDialog}>
              <Download size={18} aria-hidden="true" />
              Instalar a Calm & Study
            </button>
          </section>
        </nav>
        <div className="side-bottom">
          <button
            className="suggest-topic-shortcut"
            onClick={() => {
              openSuggestion();
              setMobileMenuOpen(false);
            }}
          >
            <Lightbulb size={15} aria-hidden="true" /> Sugerir um tema
          </button>
          <div className="daily-card">
            <span className="tiny-icon">
              <Lightbulb size={16} aria-hidden="true" />
            </span>
            <strong>Curiosidade não tem pressa</strong>
            <p>Uma pergunta de cada vez. Explore no seu ritmo.</p>
            <div className="streak">
              <span aria-hidden="true">✳</span> Conhecimento com contexto
            </div>
          </div>
        </div>
      </aside>
      {mobileMenuOpen && (
        <button
          className="mobile-menu-backdrop"
          aria-label="Fechar menu principal"
          aria-hidden="true"
          tabIndex={-1}
          onClick={() => {
            setMobileMenuOpen(false);
            window.requestAnimationFrame(() =>
              document.getElementById('mobile-menu-toggle')?.focus(),
            );
          }}
        />
      )}
      <main className="main" id="conteudo" tabIndex={-1} aria-label="Conteúdo principal">
        <header className="topbar">
          <button
            id="mobile-menu-toggle"
            className="mobile-menu icon-btn"
            aria-label={mobileMenuOpen ? 'Fechar menu principal' : 'Abrir menu principal'}
            aria-controls="main-navigation"
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen(value => !value)}
          >
            {mobileMenuOpen ? (
              <X size={19} aria-hidden="true" />
            ) : (
              <Menu size={20} aria-hidden="true" />
            )}
          </button>
          <nav className="breadcrumb" aria-label="Você está em">
            <span>Calm & Study</span>
            <span aria-hidden="true">/</span>
            <b aria-current="page">{active}</b>
          </nav>
          <span className="demo-badge">ACERVO · {topics.length} ARTIGOS</span>
          <div className="top-actions">
            <LearningModePicker mode={learningMode} onChange={changeLearningMode} />
            <button
              className="install-trigger"
              aria-label="Instalar a Calm & Study como aplicativo"
              onClick={openInstallDialog}
            >
              <Download size={16} aria-hidden="true" />
              <span>Instalar app</span>
            </button>
            <button className="search-top" aria-label="Buscar um assunto" onClick={focusSearch}>
              <Search size={16} aria-hidden="true" />
              <span>Buscar um assunto</span>
            </button>
            <button
              className={`appearance-trigger ${showAppearance ? 'opened' : ''}`}
              aria-label="Personalizar aparência"
              aria-controls="appearance-panel"
              aria-expanded={showAppearance}
              onClick={() => setShowAppearance(!showAppearance)}
            >
              <Settings2 size={16} aria-hidden="true" />
              <span>Aparência</span>
            </button>
          </div>
          {showAppearance && (
            <AppearancePanel
              palette={palette}
              layout={layout}
              font={font}
              fontSize={fontSize}
              readingProgress={readingProgress}
              onChange={applyPreference}
              onClose={() => setShowAppearance(false)}
            />
          )}
        </header>
        <Suspense fallback={<PageLoading />}>
          {active === 'Novidades' ? (
            <ReleaseNotes />
          ) : active === 'Agradecimentos' ? (
            <AcknowledgementsPage />
          ) : active === 'Direitos e transparência' ? (
            <ContentPolicyPage />
          ) : active === 'Pesquisar fontes' ? (
            <PublicResearch />
          ) : active === 'Estatísticas' ? (
            <EngagementDashboard
              topics={topics}
              paths={studyPaths}
              tutorials={tutorials}
              available={engagement.available}
              get={engagement.get}
              onToggleLike={engagement.toggleLike}
            />
          ) : active === 'Jornada' ? (
            <GameModeScreen topics={topics} trails={studyPaths} tutorials={tutorials} />
          ) : active === 'Mapa de assuntos' ? (
            <KnowledgeMap
              topics={topics}
              onOpenTopic={topic => {
                setSelected(topic);
                engagement.trackRead('article', topic.id);
              }}
            />
          ) : active === 'Tutoriais' ? (
            <TutorialsScreen
              tutorials={tutorials}
              completedIds={completedTutorials}
              engagementAvailable={engagement.available}
              getEngagement={id => engagement.get('tutorial', id)}
              onToggleLike={id => void engagement.toggleLike('tutorial', id)}
              onRandom={randomTutorial}
              onOpen={tutorial => {
                setTutorialStep(0);
                setSelectedTutorial(tutorial);
                engagement.trackRead('tutorial', tutorial.id);
              }}
            />
          ) : active === 'Salvos' ? (
            <>
              <section className="welcome compact saved-welcome">
                <div className="eyebrow">
                  <Bookmark size={14} /> SUA BIBLIOTECA
                </div>
                <h1>
                  Suas descobertas,
                  <br />
                  <em>guardadas por aqui.</em>
                </h1>
                <p>Revisite os assuntos que despertaram sua curiosidade.</p>
                <button className="outline-btn saved-back" onClick={returnToDiscover}>
                  <ArrowLeft size={15} aria-hidden="true" /> Voltar para descobrir
                </button>
              </section>
              <section className="library-grid">
                {topics
                  .filter(t => saved.includes(t.id))
                  .map(t => (
                    <LibraryTopicCard
                      key={t.id}
                      topic={t}
                      onOpen={() => setSelected(t)}
                      engagementAvailable={engagement.available}
                      engagement={engagement.get('article', t.id)}
                      onToggleLike={() => void engagement.toggleLike('article', t.id)}
                      read={readTopics.includes(t.id)}
                      onToggleRead={() => toggleRead(t.id)}
                    />
                  ))}
                {saved.length === 0 && (
                  <div className="empty">
                    <Bookmark size={28} />
                    <h3>Nenhuma descoberta salva ainda</h3>
                    <p>Use o marcador em um assunto para encontrá-lo aqui depois.</p>
                    <button className="primary small-primary" onClick={returnToDiscover}>
                      Explorar assuntos <ArrowRight size={15} />
                    </button>
                  </div>
                )}
              </section>
            </>
          ) : active === 'Trilhas de estudo' ? (
            <StudyPathsScreen
              paths={studyPaths}
              topics={topics}
              onSelectTopic={setSelected}
              engagementAvailable={engagement.available}
              getEngagement={id => engagement.get('trail', id)}
              onToggleLike={id => void engagement.toggleLike('trail', id)}
              onTrackRead={id => engagement.trackRead('trail', id)}
            />
          ) : (
            <DiscoveryScreen
              topics={topics}
              matchingTopics={matching}
              fields={fields}
              matchingFields={matchingFields}
              field={field}
              query={query}
              fieldQuery={fieldQuery}
              showFilters={showFilters}
              saved={saved}
              readIds={readTopics}
              onFieldChange={setField}
              onQueryChange={setQuery}
              onSearchSubmit={closeScienceFilters}
              onFieldQueryChange={setFieldQuery}
              onToggleFilters={() => setShowFilters(value => !value)}
              onToggleSaved={toggleSaved}
              onToggleRead={toggleRead}
              onSelectTopic={setSelected}
              onRandom={random}
              onSuggestTopic={suggestMissingTopic}
              onExplorePaths={() => selectSection('Trilhas de estudo')}
              countInField={countInField}
              engagementAvailable={engagement.available}
              getEngagement={id => engagement.get('article', id)}
              onToggleLike={id => void engagement.toggleLike('article', id)}
              latestUpdate={releaseNotes[0] as [string, string]}
              onViewUpdates={() => selectSection('Novidades')}
            />
          )}
        </Suspense>
        <footer ref={footerRef} className="site-footer">
          <p className="footer-motto">
            Aprender com calma, no seu ritmo <span aria-hidden="true">✳</span> Conhecimento com contexto
          </p>
          <p className="creator-credit">
            Calm & Study · © {new Date().getFullYear()}. Código sob MIT; textos originais sob CC BY
            4.0; materiais de terceiros seguem suas próprias licenças e atribuições.
          </p>
          <nav className="footer-links" aria-label="Informações do projeto">
            <button className="about-link" onClick={() => setWelcomeOpen(true)}>
              Sobre a Calm & Study
            </button>
            <button className="about-link" onClick={() => setActive('Agradecimentos')}>
              Agradecimentos
            </button>
            <button className="about-link" onClick={() => setActive('Direitos e transparência')}>
              Direitos e transparência
            </button>
          </nav>
          <p className="footer-demo">
            {active === 'Pesquisar fontes'
              ? 'Resultados públicos ao vivo; confira antes de usar'
              : 'Catálogo demonstrativo; índices ainda não auditados'}
          </p>
        </footer>
      </main>
      {showPauseReminder && (
        <aside
          className="screen-break-reminder"
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          <div className="screen-break-mark" aria-hidden="true">
            <HeartHandshake size={19} />
          </div>
          <div className="screen-break-copy">
            <strong>Uma pausa também faz parte de aprender.</strong>
            <p>
              Esta aba está ativa há um tempinho. Se puder, respire, beba uma água, faça carinho no
              pet ou mande uma mensagem a alguém querido. Seu bem-estar vem antes da Calm & Study.
            </p>
          </div>
          <div className="screen-break-actions">
            <button
              onClick={() => {
                pauseReminderControlRef.current.dismissed = true;
                pauseReminderControlRef.current.shown = false;
                setShowPauseReminder(false);
              }}
            >
              Vou pausar agora
            </button>
            <button
              onClick={() => {
                pauseReminderControlRef.current.snoozeUntil = activeSecondsRef.current + 20 * 60;
                pauseReminderControlRef.current.shown = false;
                setShowPauseReminder(false);
              }}
            >
              Lembrar em 20 min
            </button>
            <button
              onClick={() => {
                pauseReminderControlRef.current.dismissed = true;
                pauseReminderControlRef.current.shown = false;
                setShowPauseReminder(false);
              }}
            >
              Continuar por enquanto
            </button>
          </div>
        </aside>
      )}
      <Suspense fallback={null}>
        {selected && (
          <ReaderDialog
            topic={current}
            saved={saved.includes(current.id)}
            readingProgress={readingProgress}
            sourceCandidates={sourceCandidates}
            onClose={closeReader}
            onOpenTopic={setSelected}
            onToggleSaved={toggleCurrentSaved}
            onReview={reviewTopic}
            onRandom={random}
            engagementAvailable={engagement.available}
            engagement={engagement.get('article', current.id)}
            onToggleLike={() => void engagement.toggleLike('article', current.id)}
            read={readTopics.includes(current.id)}
            onToggleRead={() => toggleRead(current.id)}
          />
        )}{' '}
        {selectedTutorial && (
          <TutorialDialog
            tutorial={selectedTutorial}
            step={tutorialStep}
            completedSteps={tutorialProgress[selectedTutorial.id] ?? []}
            onClose={() => setSelectedTutorial(null)}
            onComplete={() => finishTutorial(selectedTutorial.id)}
            onStepChange={setTutorialStep}
            onToggleStep={index => toggleTutorialStep(selectedTutorial.id, index)}
          />
        )}
        {welcomeOpen && (
          <WelcomeDialog
            onClose={closeWelcome}
            onQuick={() => {
              closeWelcome();
              random();
            }}
            onTour={startWelcomeTour}
            onModeSelect={changeLearningMode}
          />
        )}
        {welcomeTourIndex !== null && (
          <WelcomeTour
            stop={welcomeTourStops[welcomeTourIndex]}
            index={welcomeTourIndex}
            total={welcomeTourStops.length}
            onBack={() => moveWelcomeTour(-1)}
            onNext={() => moveWelcomeTour(1)}
            onClose={() => setWelcomeTourIndex(null)}
          />
        )}
        {installDialogOpen && (
          <InstallAppDialog
            canInstall={Boolean(installPrompt)}
            isInstalled={isInstalled}
            onInstall={installApp}
            onClose={() => setInstallDialogOpen(false)}
          />
        )}
        {suggestionOpen && (
          <SuggestionDialog
            draft={suggestionDraft}
            setDraft={setSuggestionDraft}
            suggestions={suggestions}
            submitting={submittingSuggestion}
            message={submissionMessage}
            onClose={() => setSuggestionOpen(false)}
            onSave={saveSuggestion}
            onRetry={retrySuggestions}
          />
        )}
      </Suspense>
      {showBackToTop && !welcomeOpen && !installDialogOpen && !suggestionOpen && (
        <button
          className="back-to-top"
          onClick={() =>
            window.scrollTo({
              top: 0,
              behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
                ? 'instant'
                : 'smooth',
            })
          }
          aria-label="Voltar ao topo da página"
          title="Voltar ao topo"
        >
          <ArrowUp size={17} aria-hidden="true" />
          <span>Topo</span>
        </button>
      )}
      {!footerVisible && !welcomeOpen && !installDialogOpen && !suggestionOpen && (
        <button className="mobile-suggest" onClick={openSuggestion}>
          <Lightbulb size={16} aria-hidden="true" /> Sugerir tema
        </button>
      )}
      {toast && (
        <div className="toast" role="status" aria-live="polite">
          <Check size={15} aria-hidden="true" />
          {toast}
        </div>
      )}
    </div>
  );
}
