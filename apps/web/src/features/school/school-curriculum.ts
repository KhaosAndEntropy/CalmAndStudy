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

// Textos didáticos desta coleção são sínteses autorais; o código aponta para a BNCC oficial.
export type SchoolSkill = {
  stage: SchoolStageId;
  year: string;
  yearLabel?: string;
  subject: string;
  code: string;
  title: string;
  summary: string;
  goal: string;
  studyContent: { title: string; body: string }[];
  studySteps: string[];
  questions: SchoolQuestion[];
};

export type SchoolQuestion = {
  prompt: string;
  options: string[];
  correctOption: number;
  hint: string;
  explanation: string;
};

export const pilotSkills: SchoolSkill[] = [
  {
    stage: 'fundamental-inicial',
    year: '1',
    subject: 'Matemática',
    code: 'EF01MA01',
    title: 'Números no cotidiano',
    summary:
      'No cotidiano, um número pode contar objetos, indicar uma posição ou identificar algo, como uma linha de ônibus.',
    goal: 'Perceber que um número pode contar, indicar uma posição ou funcionar como identificação.',
    studyContent: [
      {
        title: 'Número para contar',
        body: 'Quando contamos objetos, o número informa quantos há: três livros, cinco frutas ou duas pessoas.',
      },
      {
        title: 'Número para ordenar',
        body: 'Em uma fila ou sequência, números indicam posições. Primeiro, segundo e terceiro mostram uma ordem, não a quantidade total.',
      },
      {
        title: 'Número para identificar',
        body: 'Alguns números funcionam como nomes ou códigos. O número 305 de uma linha de ônibus não informa que existem 305 ônibus.',
      },
    ],
    studySteps: [
      'Separe alguns objetos, conte quantos há e registre o total.',
      'Organize três objetos em fila e diga qual está em primeiro, segundo e terceiro lugar.',
      'Observe um número de ônibus ou de casa: ele identifica algo, não conta objetos.',
    ],
    questions: [
      {
        prompt: 'Na linha de ônibus 305, o número indica principalmente…',
        options: ['uma quantidade de ônibus', 'uma posição na fila', 'a identificação da linha'],
        correctOption: 2,
        hint: 'Pense se o número está contando objetos ou distinguindo uma linha de outra.',
        explanation: 'É um código de identificação: ele diferencia essa linha das demais.',
      },
      {
        prompt: 'Há 8 lápis sobre a mesa. O número 8 está sendo usado para…',
        options: ['contar uma quantidade', 'identificar a mesa', 'indicar o oitavo lugar'],
        correctOption: 0,
        hint: 'O número responde à pergunta “quantos lápis?”.',
        explanation: 'O 8 representa a quantidade de lápis que foi contada.',
      },
      {
        prompt: 'Ana ficou em 2º lugar numa corrida. O “2º” indica…',
        options: [
          'duas pessoas na corrida',
          'uma posição na ordem de chegada',
          'o número de identificação de Ana',
        ],
        correctOption: 1,
        hint: 'A expressão “ficou em” aponta para uma colocação.',
        explanation: 'O ordinal 2º informa a posição de Ana na ordem de chegada.',
      },
    ],
  },
  {
    stage: 'fundamental-final',
    year: '6',
    subject: 'Ciências',
    code: 'EF06CI01',
    title: 'Misturas que vemos por aí',
    summary:
      'Para classificar uma mistura, observe quantas fases distintas podem ser percebidas e se os materiais parecem uniformes.',
    goal: 'Observar uma mistura e identificar se seus materiais formam uma ou mais fases visíveis.',
    studyContent: [
      {
        title: 'Materiais e fases',
        body: 'Uma mistura combina materiais. Fase é cada porção visualmente uniforme que conseguimos distinguir. A aparência ajuda a descrever a mistura, mas não revela tudo sobre sua composição.',
      },
      {
        title: 'Uma fase visível',
        body: 'Quando a mistura parece uniforme e apresenta uma única fase visível, ela é classificada como homogênea. Sal completamente dissolvido em água é um exemplo cotidiano.',
      },
      {
        title: 'Mais de uma fase visível',
        body: 'Quando conseguimos observar regiões diferentes, como óleo separado da água ou areia depositada, a mistura é heterogênea. Não prove nem manipule substâncias desconhecidas.',
      },
    ],
    studySteps: [
      'Imagine ou observe água com sal, água com óleo e água com areia.',
      'Registre se é possível distinguir os materiais a olho nu.',
      'Classifique as misturas e explique qual observação ajudou na decisão.',
    ],
    questions: [
      {
        prompt:
          'Depois de misturar água e óleo e deixar o recipiente parado, o que tende a ser observado?',
        options: ['uma única fase uniforme', 'duas fases visíveis', 'o óleo desaparece'],
        correctOption: 1,
        hint: 'Observe se os materiais permanecem distribuídos de maneira uniforme.',
        explanation: 'Água e óleo formam fases distintas visíveis; a mistura é heterogênea.',
      },
      {
        prompt: 'Se o sal se dissolve completamente na água, a mistura apresenta, a olho nu…',
        options: ['uma fase uniforme', 'uma fase para cada grão de sal', 'duas camadas separadas'],
        correctOption: 0,
        hint: 'Considere o aspecto depois que o sal se dissolveu por completo.',
        explanation:
          'Com o sal totalmente dissolvido, a solução apresenta uma fase visível e é classificada como homogênea.',
      },
      {
        prompt: 'Água com areia, observada após repouso, é um exemplo de mistura…',
        options: [
          'homogênea, pois a areia vira água',
          'heterogênea, pois há fases distinguíveis',
          'sem materiais misturados',
        ],
        correctOption: 1,
        hint: 'A areia continua sendo distinguível ou se distribui como o sal dissolvido?',
        explanation:
          'A areia não se dissolve como o sal e pode ser distinguida da água, formando mais de uma fase.',
      },
    ],
  },
  {
    stage: 'medio',
    year: '1-3',
    yearLabel: '1º ao 3º ano',
    subject: 'Ciências da Natureza e suas Tecnologias',
    code: 'EM13CNT101',
    title: 'Transformações e conservação',
    summary:
      'Modelos ajudam a acompanhar mudanças de matéria, energia e movimento, reconhecer transferências e justificar previsões sobre sistemas.',
    goal: 'Usar modelos para descrever o que se transforma, o que se conserva e o que pode acontecer em seguida.',
    studyContent: [
      {
        title: 'Defina o sistema',
        body: 'Um sistema é a parte da situação que escolhemos observar. Antes de analisar uma mudança, diga o que está dentro dele e o que fica no ambiente ao redor.',
      },
      {
        title: 'Descreva antes e depois',
        body: 'Registre matéria, energia ou movimento relevantes em cada momento. Um desenho, uma tabela ou um esquema pode ajudar a comparar os estados do sistema.',
      },
      {
        title: 'Investigue transferências e conservação',
        body: 'Uma quantidade pode mudar de forma ou ser transferida entre o sistema e o ambiente. Para concluir o que se conserva, explicite os limites escolhidos e use evidências; não presuma que toda grandeza permanece igual dentro de um sistema aberto.',
      },
    ],
    studySteps: [
      'Escolha uma situação cotidiana que envolva energia, matéria ou movimento.',
      'Desenhe ou descreva o sistema antes e depois da transformação.',
      'Indique o que mudou, o que se conservou e quais dados sustentam sua previsão.',
    ],
    questions: [
      {
        prompt: 'Ao acender uma lâmpada, qual descrição representa melhor a energia?',
        options: [
          'Ela desaparece ao produzir luz.',
          'Ela se transforma e parte é transferida ao ambiente.',
          'Ela fica toda armazenada no interruptor.',
        ],
        correctOption: 1,
        hint: 'Considere tanto a luz emitida quanto o aquecimento da lâmpada e do ambiente.',
        explanation:
          'A energia elétrica se transforma em luz e também em energia térmica, que pode ser transferida ao ambiente.',
      },
      {
        prompt: 'Por que dizer apenas “a energia sumiu” é uma explicação insuficiente?',
        options: [
          'Porque devemos investigar transformações e transferências.',
          'Porque energia só existe em pilhas.',
          'Porque toda energia precisa ficar visível.',
        ],
        correctOption: 0,
        hint: 'Procure descrever para onde a energia foi e de que modo a situação mudou.',
        explanation:
          'Um modelo útil identifica as formas de energia e as transferências envolvidas, em vez de concluir que ela simplesmente desapareceu.',
      },
      {
        prompt:
          'Para estudar a água aquecida numa chaleira, qual escolha ajuda a analisar o sistema?',
        options: [
          'Definir se o sistema inclui só a água ou também a chaleira.',
          'Ignorar o ambiente e qualquer transferência.',
          'Afirmar que a temperatura nunca muda.',
        ],
        correctOption: 0,
        hint: 'O que está dentro do sistema depende do limite que você escolhe estudar.',
        explanation:
          'Definir a fronteira do sistema permite identificar trocas de energia entre a água, a chaleira e o ambiente.',
      },
    ],
  },
];

export const additionalSchoolSkills: SchoolSkill[] = [
  {
    stage: 'fundamental-final',
    year: '6',
    subject: 'Matemática',
    code: 'EF06MA01',
    title: 'Números na reta',
    summary:
      'Leia, compare e ordene números naturais e decimais positivos usando referências como a reta numérica.',
    goal: 'Comparar números e explicar sua posição relativa na reta numérica.',
    studyContent: [
      {
        title: 'A reta organiza números',
        body: 'Na reta numérica, valores aumentam da esquerda para a direita. A posição ajuda a comparar números sem depender apenas de como seus algarismos parecem.',
      },
      {
        title: 'Decimais entre inteiros',
        body: 'Entre 2 e 3 há décimos como 2,4 e 2,75. Primeiro compare a parte inteira; se ela for igual, observe as casas decimais na ordem.',
      },
      {
        title: 'Compare com cuidado',
        body: 'Escrever 2,5 como 2,50 pode facilitar a comparação com 2,45. A casa acrescentada à direita não muda o valor do número.',
      },
    ],
    studySteps: [
      'Marque 0, 1 e 2 numa reta e divida cada unidade em dez partes iguais.',
      'Posicione 0,4, 1,25 e 1,7; confira se valores maiores ficam à direita.',
      'Compare dois números e explique qual referência usou para decidir.',
    ],
    questions: [
      {
        prompt: 'Qual número fica mais à direita na reta numérica?',
        options: ['1,8', '1,35', '1,5'],
        correctOption: 0,
        hint: 'A parte inteira é igual nos três números. Compare os décimos.',
        explanation: '1,8 é maior que 1,5 e 1,35; por isso fica mais à direita.',
      },
      {
        prompt: 'Qual comparação está correta?',
        options: ['2,45 > 2,5', '2,45 < 2,50', '2,45 = 2,50'],
        correctOption: 1,
        hint: 'Escreva 2,5 como 2,50 para comparar as mesmas casas decimais.',
        explanation: 'Como 45 centésimos são menos que 50 centésimos, 2,45 < 2,50.',
      },
      {
        prompt: 'Em uma reta, onde fica 0,6 em relação a 0,4?',
        options: [
          'À esquerda, pois 6 é maior que 4.',
          'No mesmo ponto.',
          'À direita, pois 0,6 é maior que 0,4.',
        ],
        correctOption: 2,
        hint: 'Ambos estão entre 0 e 1. Compare os décimos.',
        explanation: 'Seis décimos são maiores que quatro décimos, então 0,6 fica à direita.',
      },
    ],
  },
  {
    stage: 'fundamental-final',
    year: '6',
    subject: 'Geografia',
    code: 'EF06GE01',
    title: 'Paisagens que mudam com o tempo',
    summary:
      'Compare um lugar em diferentes momentos para observar mudanças na paisagem e nos usos que as pessoas fazem dele.',
    goal: 'Usar registros de épocas diferentes para descrever mudanças e permanências em um lugar.',
    studyContent: [
      {
        title: 'O que chamamos de paisagem',
        body: 'Paisagem é o conjunto de elementos que podemos perceber em um lugar. Ela pode incluir componentes naturais, construções, ruas, sons e marcas das atividades humanas.',
      },
      {
        title: 'Compare o mesmo lugar',
        body: 'Fotografias, mapas ou relatos de épocas distintas ajudam a identificar o que mudou e o que permaneceu. Confira se os registros realmente mostram o mesmo local.',
      },
      {
        title: 'Investigue os usos',
        body: 'Um espaço pode mudar de função ao longo do tempo. Uma comparação cuidadosa pergunta quem usava o lugar, para quê, e quais evidências apoiam a resposta.',
      },
    ],
    studySteps: [
      'Escolha uma praça, rua ou área próxima que possa ser observada com segurança.',
      'Compare uma imagem antiga e uma atual do mesmo local e anote mudanças e permanências.',
      'Registre como as pessoas usam esse espaço hoje e indique de onde veio cada informação.',
    ],
    questions: [
      {
        prompt: 'Qual comparação oferece evidência mais útil sobre a mudança de um lugar?',
        options: [
          'Duas imagens do mesmo local, com datas ou contexto identificados.',
          'Uma imagem sem localização e uma lembrança sem referência.',
          'Imagens de dois lugares diferentes sem explicar a escolha.',
        ],
        correctOption: 0,
        hint: 'Para comparar mudanças no tempo, mantenha o local identificável e verifique quando cada registro foi feito.',
        explanation:
          'Registros do mesmo local e com contexto temporal permitem comparar características com mais segurança.',
      },
      {
        prompt: 'Uma área antes ocupada por casas agora tem uma escola. O que isso mostra?',
        options: [
          'A paisagem e o uso do espaço se transformaram.',
          'O lugar nunca mudou.',
          'A escola é um elemento natural da paisagem.',
        ],
        correctOption: 0,
        hint: 'Considere a mudança visível e a nova função do lugar.',
        explanation: 'A construção altera elementos da paisagem e o uso social dado à área.',
      },
      {
        prompt: 'Além de fotografias, qual fonte pode ajudar a conhecer usos antigos de uma praça?',
        options: [
          'Relatos de pessoas que frequentavam o local, identificados como memória oral.',
          'A cor atual do banco, sem outra informação.',
          'Uma previsão do tempo de amanhã.',
        ],
        correctOption: 0,
        hint: 'Procure um registro de alguém que conheceu o lugar naquela época.',
        explanation:
          'Relatos podem complementar imagens e documentos; é importante registrar quem contou e quando.',
      },
    ],
  },
];

export const schoolSkills = [...pilotSkills, ...additionalSchoolSkills];

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
