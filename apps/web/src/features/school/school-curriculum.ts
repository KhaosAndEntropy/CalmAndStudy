export type SchoolStageId = 'fundamental-inicial' | 'fundamental-final' | 'medio';

export type SchoolStage = {
  id: SchoolStageId;
  label: string;
  years: { value: string; label: string }[];
  subjects: string[];
};

export const schoolStages: SchoolStage[] = [
  {
    id: 'fundamental-inicial',
    label: 'Ensino Fundamental · anos iniciais',
    years: [1, 2, 3, 4, 5].map(year => ({ value: String(year), label: `${year}º ano` })),
    subjects: ['Língua Portuguesa', 'Matemática', 'Ciências', 'História', 'Geografia'],
  },
  {
    id: 'fundamental-final',
    label: 'Ensino Fundamental · anos finais',
    years: [6, 7, 8, 9].map(year => ({ value: String(year), label: `${year}º ano` })),
    subjects: [
      'Língua Portuguesa',
      'Matemática',
      'Ciências',
      'História',
      'Geografia',
      'Língua Inglesa',
    ],
  },
  {
    id: 'medio',
    label: 'Ensino Médio',
    years: [1, 2, 3].map(year => ({ value: String(year), label: `${year}º ano` })),
    subjects: [
      'Linguagens e suas Tecnologias',
      'Matemática e suas Tecnologias',
      'Ciências da Natureza e suas Tecnologias',
      'Ciências Humanas e Sociais Aplicadas',
    ],
  },
];

export type SchoolSkill = {
  stage: SchoolStageId;
  year: string;
  yearLabel?: string;
  subject: string;
  code: string;
  title: string;
  description: string;
  goal: string;
  studySteps: string[];
  practicePrompt: string;
  practiceAnswer: string;
};

export const pilotSkills: SchoolSkill[] = [
  {
    stage: 'fundamental-inicial',
    year: '1',
    subject: 'Matemática',
    code: 'EF01MA01',
    title: 'Números no cotidiano',
    description:
      'Utilizar números naturais como indicador de quantidade ou de ordem em diferentes situações cotidianas e reconhecer situações em que os números não indicam contagem nem ordem, mas sim código de identificação.',
    goal: 'Perceber que um número pode contar, indicar uma posição ou funcionar como identificação.',
    studySteps: [
      'Separe alguns objetos, conte quantos há e registre o total.',
      'Organize três objetos em fila e diga qual está em primeiro, segundo e terceiro lugar.',
      'Observe um número de ônibus ou de casa: ele identifica algo, não conta objetos.',
    ],
    practicePrompt:
      'Na linha de ônibus 305, o número indica uma quantidade, uma ordem ou uma identificação?',
    practiceAnswer: 'É uma identificação: o número diferencia aquela linha de outras.',
  },
  {
    stage: 'fundamental-final',
    year: '6',
    subject: 'Ciências',
    code: 'EF06CI01',
    title: 'Misturas que vemos por aí',
    description:
      'Classificar como homogênea ou heterogênea a mistura de dois ou mais materiais (água e sal, água e óleo, água e areia etc.).',
    goal: 'Observar uma mistura e identificar se seus materiais formam uma ou mais fases visíveis.',
    studySteps: [
      'Imagine ou observe água com sal, água com óleo e água com areia.',
      'Registre se é possível distinguir os materiais a olho nu.',
      'Classifique as misturas e explique qual observação ajudou na decisão.',
    ],
    practicePrompt:
      'Em água e óleo, os dois materiais ficam distribuídos em uma única fase visível?',
    practiceAnswer:
      'Não. É possível observar fases diferentes, por isso essa mistura é heterogênea.',
  },
  {
    stage: 'medio',
    year: '1-3',
    yearLabel: '1º ao 3º ano',
    subject: 'Ciências da Natureza e suas Tecnologias',
    code: 'EM13CNT101',
    title: 'Transformações e conservação',
    description:
      'Analisar e representar, com ou sem o uso de dispositivos e de aplicativos digitais específicos, as transformações e conservações em sistemas que envolvam quantidade de matéria, de energia e de movimento para realizar previsões sobre seus comportamentos em situações cotidianas e em processos produtivos que priorizem o desenvolvimento sustentável, o uso consciente dos recursos naturais e a preservação da vida em todas as suas formas.',
    goal: 'Usar modelos para descrever o que se transforma, o que se conserva e o que pode acontecer em seguida.',
    studySteps: [
      'Escolha uma situação cotidiana que envolva energia, matéria ou movimento.',
      'Desenhe ou descreva o sistema antes e depois da transformação.',
      'Indique o que mudou, o que se conservou e quais dados sustentam sua previsão.',
    ],
    practicePrompt: 'Ao ligar uma lâmpada, a energia desaparece ou se transforma?',
    practiceAnswer:
      'Ela se transforma: parte vira luz e parte é transferida como calor ao ambiente.',
  },
];

export type SchoolSkillRelation = {
  from: string;
  to: string;
  label: string;
  explanation: string;
};

// Relações editoriais para mostrar usos interdisciplinares possíveis; não são pré-requisitos da BNCC.
export const pilotSkillRelations: SchoolSkillRelation[] = [
  {
    from: 'EF01MA01',
    to: 'EF06CI01',
    label: 'Registrar observações com números',
    explanation:
      'Reconhecer números como quantidade pode apoiar o registro de quantos materiais foram usados ou quantas fases são observadas numa mistura.',
  },
  {
    from: 'EF06CI01',
    to: 'EM13CNT101',
    label: 'Da mistura aos sistemas de matéria',
    explanation:
      'Misturas oferecem um exemplo concreto para investigar matéria, transformações e conservação em sistemas.',
  },
];

export const bnccSourceUrl =
  'https://basenacionalcomum.mec.gov.br/images/BNCC_EI_EF_110518_versaofinal_site.pdf';
export const bnccHighSchoolSourceUrl = 'https://www.gov.br/mec/pt-br/cne/bncc_ensino_medio.pdf';
