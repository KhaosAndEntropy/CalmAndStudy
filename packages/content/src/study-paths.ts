import type { StudyPath } from './types';

/**
 * Study paths suggest useful context and progression, without blocking access
 * to any article. Notes make explicit when neighboring topics are examples,
 * comparisons, or separate processes rather than direct causes.
 */
export const studyPaths: StudyPath[] = [
  {
    id: 'sky-and-time',
    title: 'Do céu observado aos movimentos dos planetas',
    field: 'Astronomia · 4 assuntos',
    description:
      'Comece por um instrumento antigo que acompanhava ciclos celestes e compare rotação, órbita e duração dos dias em Vênus e Marte.',
    topicIds: ['antikythera', 'venus', 'venus-retrograde', 'mars-sol'],
    connectionNote:
      'A sequência passa da observação astronômica para exemplos planetários. O mecanismo de Anticítera não foi usado para estudar esses planetas especificamente.',
  },
  {
    id: 'planetary-histories',
    title: 'Duas histórias de transformação planetária',
    field: 'Ciência Planetária · 2 assuntos',
    description:
      'Conheça uma hipótese para a formação da Lua e avance para medições sobre a perda de atmosfera em Marte.',
    topicIds: ['moon-giant-impact', 'mars-atmosphere-loss'],
    connectionNote:
      'São processos diferentes em corpos diferentes. A hipótese do grande impacto é uma explicação para a origem da Lua; as medições da MAVEN investigam a atmosfera marciana.',
  },
  {
    id: 'universe-to-life',
    title: 'Do universo jovem à busca por vida',
    field: 'Cosmologia · 3 assuntos',
    description:
      'Parta de uma evidência do universo jovem, veja como planetas distantes são detectados e conheça os critérios usados na busca por vida.',
    topicIds: ['cosmic-background', 'exoplanet-methods', 'astrobiology-life-search'],
    connectionNote:
      'A sequência vai da cosmologia a sistemas planetários e à astrobiologia. Detectar um exoplaneta ou uma molécula não confirma a existência de vida.',
  },
  {
    id: 'routes-and-artifacts',
    title: 'Rotas, objetos e circulação cultural',
    field: 'História · 3 assuntos',
    description:
      'Explore redes de intercâmbio, aprenda a ler objetos em seus contextos e veja como registros arqueológicos são documentados digitalmente.',
    topicIds: ['silk', 'art-history-context', 'digital-archaeology-records'],
    connectionNote:
      'Os assuntos se conectam pelo estudo de circulação e cultura material; não afirmam que os objetos citados tenham viajado pela Rota da Seda.',
  },
  {
    id: 'human-timeline',
    title: 'Uma cronologia: ferramentas, pessoas e registros',
    field: 'Arqueologia e Antropologia · 5 assuntos',
    description:
      'Entenda os limites do registro fóssil e percorra marcos muito distantes no tempo, das ferramentas antigas ao início da escrita cuneiforme.',
    topicIds: [
      'fossilization-rare',
      'stone-tools',
      'homo-sapiens-africa',
      'agriculture-many-origins',
      'cuneiform-writing',
    ],
    connectionNote:
      'Ferramentas de pedra são muito anteriores a Homo sapiens. A agricultura surgiu em épocas e regiões distintas, e a escrita cuneiforme apareceu muito depois; a sequência não atribui todas essas mudanças a um único povo.',
  },
  {
    id: 'ancient-writing',
    title: 'Escritas antigas e como estudamos seus vestígios',
    field: 'História e Linguística · 3 assuntos',
    description:
      'Conheça a escrita cuneiforme, veja como a Pedra de Roseta ajudou a decifrar hieróglifos e termine com métodos digitais de documentação arqueológica.',
    topicIds: ['cuneiform-writing', 'rosetta-decipherment', 'digital-archaeology-records'],
    connectionNote:
      'Cuneiforme e hieróglifos pertencem a culturas e sistemas distintos. A Pedra de Roseta não decifrou a escrita cuneiforme; os casos aparecem juntos como exemplos de pesquisa sobre escritas antigas.',
  },
  {
    id: 'places-maps-and-space',
    title: 'Lugares, mapas e propriedades do espaço',
    field: 'Geografia e Matemática · 3 assuntos',
    description:
      'Comece pelas perguntas da geografia, descubra o que as projeções distorcem e avance para a ideia matemática de continuidade.',
    topicIds: ['geography-patterns', 'map-projections', 'topology-continuity'],
    connectionNote:
      'Topologia oferece um aprofundamento matemático sobre espaço e continuidade; ela não é necessária para ler mapas do cotidiano.',
  },
  {
    id: 'water-from-soil-to-ground',
    title: 'Da superfície ao armazenamento subterrâneo da água',
    field: 'Hidrologia e Ciência do Solo · 3 assuntos',
    description:
      'Veja como os solos se formam, acompanhe a circulação da água e descubra como parte dela fica armazenada em aquíferos.',
    topicIds: ['soil-horizons', 'water-cycle', 'groundwater-aquifers'],
    connectionNote:
      'Solo, ciclo hidrológico e aquíferos se relacionam pelo movimento e armazenamento da água. A infiltração real depende das condições locais.',
  },
  {
    id: 'earth-processes',
    title: 'Rochas, placas e sinais do interior da Terra',
    field: 'Geologia · 4 assuntos',
    description:
      'Parta do que define um mineral, passe pelos limites das placas e veja como terremotos e vulcões são estudados.',
    topicIds: [
      'mineral-definition',
      'earthquakes-plates',
      'seismic-waves',
      'volcano-eruption-style',
    ],
    connectionNote:
      'Placas ajudam a explicar muitos terremotos e vulcões, mas nem todos ocorrem em limites de placas. Ondas sísmicas são uma ferramenta para investigar o interior terrestre.',
  },
  {
    id: 'weather-to-climate',
    title: 'Do tempo local aos padrões de clima',
    field: 'Atmosfera e Clima · 5 assuntos',
    description:
      'Construa contexto sobre padrões atmosféricos, frentes, calor oceânico, ENSO e geleiras como registros das condições ambientais.',
    topicIds: [
      'atmosphere-layers',
      'meteorology-air-masses',
      'ocean-heat',
      'enso-pacific',
      'glacier-flow',
    ],
    connectionNote:
      'Tempo e clima operam em escalas diferentes. O ENSO é um padrão específico do sistema oceano-atmosfera, e geleiras respondem a balanços de massa ao longo do tempo.',
  },
  {
    id: 'ocean-chemistry-and-life',
    title: 'Mudanças no oceano e seus ecossistemas',
    field: 'Oceanografia e Ecologia · 4 assuntos',
    description:
      'Compare o armazenamento de calor e as mudanças químicas do oceano com as redes alimentares marinhas e os desafios da conservação.',
    topicIds: [
      'ocean-heat',
      'ocean-acidification',
      'marine-food-webs',
      'biodiversity-conservation',
    ],
    connectionNote:
      'Aquecimento e acidificação são processos diferentes, embora possam coexistir. Seus efeitos variam por região, espécie e condições locais.',
  },
  {
    id: 'energy-through-ecosystems',
    title: 'Da luz às relações entre os seres vivos',
    field: 'Biologia e Ecologia · 4 assuntos',
    description:
      'Entenda como a fotossíntese armazena energia, como ela se move nas redes alimentares e por que conservar habitats importa.',
    topicIds: [
      'photosynthesis-energy',
      'ecosystem-energy',
      'marine-food-webs',
      'biodiversity-conservation',
    ],
    connectionNote:
      'A fotossíntese sustenta muitas redes, mas não todas: ecossistemas também podem depender de outras fontes de energia, como a quimiossíntese.',
  },
  {
    id: 'cell-to-genome',
    title: 'Da célula às instruções genéticas',
    field: 'Biologia Molecular · 5 assuntos',
    description:
      'Conheça a célula, explore processos físicos e químicos em escala molecular e avance até DNA, RNA e sequências de referência do genoma.',
    topicIds: [
      'cell-basic-unit',
      'biophysics-scale',
      'biochemistry-enzymes',
      'molecular-dna-rna',
      'human-genome',
    ],
    connectionNote:
      'Cada leitura amplia a escala de observação. A sequência completa publicada em 2022 é uma referência de pesquisa, não uma sequência idêntica para todas as pessoas.',
  },
  {
    id: 'evolution-and-animal-diversity',
    title: 'Evolução e diversidade animal',
    field: 'Biologia Evolutiva e Zoologia · 4 assuntos',
    description:
      'Comece pelas mudanças em populações ao longo de gerações e compare diferentes formas de organizar a diversidade animal.',
    topicIds: ['evolution-populations', 'animal-diversity', 'insects-body-plan', 'octopus'],
    connectionNote:
      'Insetos e polvos são exemplos distintos da diversidade animal; um não representa uma etapa evolutiva do outro.',
  },
  {
    id: 'nervous-system-and-learning',
    title: 'Do sinal nervoso à aprendizagem',
    field: 'Neurociência e Psicologia · 4 assuntos',
    description:
      'Passe da comunicação entre neurônios para processos cognitivos e aprendizagem, usando os braços do polvo como comparação de organização nervosa.',
    topicIds: ['neuron-signals', 'octopus', 'cognitive-processes', 'psychology-learning'],
    connectionNote:
      'O sistema nervoso do polvo é um exemplo comparativo, não uma explicação direta da cognição humana ou da aprendizagem.',
  },
  {
    id: 'body-and-health',
    title: 'Estruturas do corpo e suas defesas',
    field: 'Anatomia e Fisiologia · 3 assuntos',
    description:
      'Relacione estruturas anatômicas, regulação fisiológica e respostas do sistema imune.',
    topicIds: ['anatomy-structure-function', 'physiology-homeostasis', 'immune-response'],
    connectionNote:
      'Anatomia descreve estruturas; fisiologia investiga seu funcionamento. A resposta imune é um dos sistemas que participa da manutenção da saúde.',
  },
  {
    id: 'infection-and-public-health',
    title: 'Microrganismos, prevenção e tratamentos',
    field: 'Saúde Pública · 4 assuntos',
    description:
      'Entenda como padrões epidemiológicos ajudam a acompanhar resistência antimicrobiana, prevenir riscos e avaliar medicamentos.',
    topicIds: [
      'epidemiology-patterns',
      'antimicrobial-resistance',
      'food-safety-science',
      'drug-development-evidence',
    ],
    connectionNote:
      'Resistência, segurança dos alimentos e desenvolvimento de medicamentos são partes diferentes da saúde pública. Este percurso não substitui orientação clínica.',
  },
  {
    id: 'light-to-particles',
    title: 'Da luz às partículas fundamentais',
    field: 'Física · 4 assuntos',
    description:
      'Compare a formação de imagens por lentes, os comportamentos quânticos da luz, a fissão de núcleos e a descoberta do bóson de Higgs.',
    topicIds: ['optics-images', 'quantum-light', 'nuclear-fission-basics', 'higgs-discovery'],
    connectionNote:
      'Os artigos percorrem escalas e teorias diferentes. A física quântica é importante para entender fenômenos microscópicos, mas cada descoberta depende de experimentos próprios.',
  },
  {
    id: 'elements-energy-materials',
    title: 'Elementos, energia e materiais',
    field: 'Química e Ciência dos Materiais · 3 assuntos',
    description:
      'Use a tabela periódica como ponto de partida, acompanhe como a energia é descrita e veja como a estrutura influencia propriedades dos materiais.',
    topicIds: ['periodic-pattern', 'thermodynamics-energy', 'materials-structure'],
    connectionNote:
      'Composição, energia e estrutura são dimensões complementares; nenhuma propriedade de um material depende apenas de um único fator.',
  },
  {
    id: 'measurement-to-models',
    title: 'Medir, comparar e construir modelos',
    field: 'Matemática e Estatística · 4 assuntos',
    description:
      'Conheça a definição precisa de um segundo, veja como escalas logarítmicas comparam magnitudes e avance de amostras para modelos.',
    topicIds: ['second-atomic', 'logarithmic-scales', 'statistics-samples', 'applied-models'],
    connectionNote:
      'São ferramentas para perguntas diferentes: uma unidade de tempo, uma forma de representar magnitudes, inferência estatística e modelos com hipóteses explícitas.',
  },
  {
    id: 'logic-and-proof',
    title: 'Argumentos, números e demonstrações',
    field: 'Lógica e Matemática · 3 assuntos',
    description:
      'Relembre o que torna uma inferência válida, conheça os números primos e acompanhe uma demonstração clássica de que eles não acabam.',
    topicIds: ['logic-validity', 'number-theory-primes', 'infinite-primes'],
    connectionNote:
      'Validade é uma propriedade de argumentos; a demonstração de Euclides usa uma sequência de inferências para mostrar que os primos são infinitos.',
  },
  {
    id: 'formal-logic-and-reference',
    title: 'Quando uma afirmação usa um nome sem referente',
    field: 'Filosofia e Lógica · 2 assuntos',
    description:
      'Comece pelas condições de validade de um argumento e avance para uma teoria lógica que trata de nomes sem objeto correspondente.',
    topicIds: ['logic-validity', 'names-in-logic'],
    connectionNote:
      'A lógica livre é um aprofundamento específico: ela ajusta certas regras para analisar nomes vazios, como personagens fictícios.',
  },
  {
    id: 'computing-to-autonomous-systems',
    title: 'Da comunicação digital a sistemas autônomos',
    field: 'Computação e Engenharia · 4 assuntos',
    description:
      'Veja como pacotes transportam dados, conheça limites e riscos de sistemas de IA e avance para robôs que precisam agir com autonomia.',
    topicIds: ['ip-datagrams', 'ai-risk-context', 'robotics-autonomy', 'engineering-systems'],
    connectionNote:
      'Redes, IA, robótica e engenharia são camadas relacionadas, mas uma não é requisito universal para estudar a outra. Cada artigo apresenta limites e contextos próprios.',
  },
  {
    id: 'society-institutions-and-indicators',
    title: 'Sociedades, instituições e indicadores',
    field: 'Ciências Sociais · 3 assuntos',
    description:
      'Parta de padrões sociais, observe como instituições organizam decisões coletivas e termine com um exemplo de indicador econômico.',
    topicIds: ['sociology-patterns', 'political-institutions', 'measuring-inflation'],
    connectionNote:
      'A inflação é um fenômeno econômico medido por índices; ela não resume a sociedade nem descreve igualmente a experiência de todas as famílias.',
  },
];
