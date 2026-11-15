import type { Topic } from '../types';

export const spaceTopics: Topic[] = [
  {
    id: 'venus',
    title: 'Em Vênus, um dia dura mais que um ano',
    field: 'Astronomia',
    period: 'Sistema Solar',
    readingTime: 3,
    confidence: 94,
    confidenceLabel: 'Bem documentado',
    summary:
      'A rotação extremamente lenta do planeta faz seu dia sideral ultrapassar o tempo que ele leva para orbitar o Sol.',
    fact: 'Vênus completa uma rotação em cerca de 243 dias terrestres e uma volta ao redor do Sol em cerca de 225 dias terrestres.',
    detail:
      '“Dia” pode ter mais de uma definição: o dia sideral mede uma rotação em relação às estrelas; o dia solar mede o intervalo entre dois meios-dias locais. Vênus gira no sentido retrógrado, então seu dia solar tem duração diferente. A comparação popular entre dia e ano usa o dia sideral.',
    sourceCount: 2,
    sources: [
      {
        name: 'NASA — Venus Facts',
        url: 'https://science.nasa.gov/venus/venus-facts/',
        kind: 'Agência espacial',
      },
      {
        name: 'NASA Solar System Exploration',
        url: 'https://solarsystem.nasa.gov/planets/venus/overview/',
        kind: 'Dados de missão',
      },
    ],
    tags: ['planetas', 'sistema solar', 'física'],
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Venus_from_Mariner_10.jpg/960px-Venus_from_Mariner_10.jpg',
      alt: 'Vênus envolta em uma densa camada de nuvens, fotografada pela sonda Mariner 10',
      credit: 'NASA/JPL-Caltech · Domínio público',
      creditUrl: 'https://commons.wikimedia.org/wiki/File:Venus_from_Mariner_10.jpg',
    },
    recommendedBefore: [
      {
        topicId: 'antikythera',
        title: 'O computador perdido dos antigos gregos',
        why: 'Ele apresenta como povos antigos observavam ciclos celestes e mediam o tempo — um contexto útil antes de comparar a rotação e a órbita de Vênus.',
      },
    ],
  },
  {
    id: 'venus-retrograde',
    title: 'Por que o Sol nasce no oeste em Vênus?',
    field: 'Astronomia',
    period: 'Sistema Solar',
    readingTime: 3,
    confidence: 95,
    confidenceLabel: 'Bem documentado',
    summary:
      'Vênus gira no sentido contrário ao da Terra, então a direção aparente do nascer e do pôr do Sol também se inverte.',
    fact: 'Em Vênus, o Sol nasceria no oeste e se poria no leste. Essa rotação retrógrada é diferente da rotação prógrada da Terra.',
    detail:
      'A direção de rotação é uma propriedade distinta da órbita do planeta ao redor do Sol. A NASA descreve a rotação de Vênus como retrógrada — de leste para oeste em comparação com a rotação prógrada da Terra, de oeste para leste. Essa diferença também ajuda a explicar por que o dia solar venusiano não tem a mesma duração que seu dia sideral.',
    sourceCount: 2,
    sources: [
      {
        name: 'NASA — Venus Facts: Orbit and Rotation',
        url: 'https://science.nasa.gov/venus/venus-facts/',
        kind: 'Agência espacial',
      },
      {
        name: 'NASA — Venus Fact Sheet',
        url: 'https://solarsystem.nasa.gov/internal_resources/1028/',
        kind: 'Ficha técnica da missão',
      },
    ],
    tags: ['planetas', 'rotação', 'sistema solar', 'física'],
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Venus_from_Mariner_10.jpg/960px-Venus_from_Mariner_10.jpg',
      alt: 'Vênus fotografada pela sonda Mariner 10, envolta em sua camada de nuvens',
      credit: 'NASA/JPL-Caltech · Domínio público',
      creditUrl: 'https://commons.wikimedia.org/wiki/File:Venus_from_Mariner_10.jpg',
    },
  },
  {
    id: 'mars-sol',
    title: 'Um dia em Marte dura pouco mais que o da Terra',
    field: 'Astronomia',
    period: 'Sistema Solar',
    readingTime: 3,
    confidence: 94,
    confidenceLabel: 'Fonte institucional',
    summary:
      'Marte gira num ritmo parecido com o terrestre, mas sua órbita ao redor do Sol é bem mais longa.',
    fact: 'Um dia solar marciano, chamado sol, dura cerca de 24,6 horas; um ano marciano equivale a aproximadamente 687 dias terrestres.',
    detail:
      'A semelhança entre a duração do dia em Marte e na Terra ajuda a planejar operações de sondas e rovers. Já as estações marcianas duram mais porque Marte leva quase dois anos terrestres para completar sua órbita. Os números são arredondados e dependem da definição do dia solar.',
    sourceCount: 1,
    sources: [
      {
        name: 'NASA — Mars Facts',
        url: 'https://science.nasa.gov/mars/facts/',
        kind: 'Agência espacial · dados planetários',
      },
    ],
    tags: ['Marte', 'planetas', 'rotação', 'órbita'],
  },
  {
    id: 'moon-giant-impact',
    title: 'A Lua provavelmente nasceu de uma colisão colossal',
    field: 'Astronomia',
    period: 'cerca de 4,5 bilhões de anos atrás',
    readingTime: 5,
    confidence: 91,
    confidenceLabel: 'Síntese científica institucional',
    summary:
      'A composição das rochas lunares e os modelos do sistema Terra-Lua apontam para um passado muito violento.',
    fact: 'A explicação mais aceita é que material lançado ao espaço após uma grande colisão com a Terra jovem se agregou e formou a Lua.',
    detail:
      'As amostras trazidas pelas missões Apollo ajudaram a descartar explicações antigas, como a captura simples de um objeto já pronto. A hipótese de grande impacto explica várias propriedades do sistema, mas detalhes — como o número de corpos envolvidos e a mistura de materiais — seguem em estudo. Por isso, “provavelmente” é mais preciso do que apresentar uma cena única como fato observado diretamente.',
    sourceCount: 2,
    sources: [
      {
        name: 'NASA Science — Moon Formation',
        url: 'https://science.nasa.gov/moon/formation/',
        kind: 'Agência espacial · síntese e evidências',
      },
      {
        name: 'NASA Solar System Exploration — Earth’s Moon, In Depth',
        url: 'https://solarsystem.nasa.gov/moons/earths-moon/in-depth.amp',
        kind: 'Agência espacial · amostras e formação',
      },
    ],
    tags: ['Lua', 'Terra', 'sistema solar', 'geologia planetária'],
    recommendedBefore: [
      {
        topicId: 'antikythera',
        title: 'O computador perdido dos antigos gregos',
        why: 'A leitura apresenta como observações e modelos ajudam a reconstruir fenômenos que não podemos observar diretamente.',
      },
    ],
    relatedTopics: ['venus', 'mars-sol'],
  },
  {
    id: 'mars-atmosphere-loss',
    title: 'O vento solar ajudou Marte a perder parte da atmosfera',
    field: 'Ciência Planetária',
    period: 'Evolução de Marte',
    readingTime: 5,
    confidence: 91,
    confidenceLabel: 'Missão espacial e análise isotópica',
    summary:
      'Medições da missão MAVEN ajudam a explicar como gases da alta atmosfera marciana escapam para o espaço.',
    fact: 'A missão MAVEN mediu processos de escape atmosférico e evidências de que Marte perdeu grande parte de sua atmosfera ao longo do tempo.',
    detail:
      'O vento solar é um fluxo de partículas carregadas vindo do Sol. Ao interagir com a alta atmosfera de Marte, pode contribuir para que íons e átomos escapem. A equipe da MAVEN também usou proporções de isótopos de argônio para estimar perdas passadas. Isso não significa que o vento solar explique sozinho todas as mudanças climáticas marcianas: impactos, química das rochas e outros processos também importam, e a história continua sendo refinada.',
    sourceCount: 2,
    sources: [
      {
        name: 'NASA — MAVEN Reveals Most of Mars’ Atmosphere Was Lost to Space',
        url: 'https://www.nasa.gov/news-release/nasas-maven-reveals-most-of-mars-atmosphere-was-lost-to-space/',
        kind: 'Agência espacial · resultados da missão',
      },
      {
        name: 'NASA Science — MAVEN mission',
        url: 'https://science.nasa.gov/mission/maven/',
        kind: 'Agência espacial · objetivos e dados da missão',
      },
    ],
    tags: ['Marte', 'atmosfera', 'vento solar', 'planetas'],
    recommendedBefore: [
      {
        topicId: 'mars-sol',
        title: 'Um dia em Marte dura pouco mais que o da Terra',
        why: 'Comece pelas características básicas de Marte; depois avance para a evolução de sua atmosfera.',
      },
    ],
  },
  {
    id: 'sunlight-travel-time',
    title: 'A luz do Sol leva pouco mais de oito minutos até a Terra',
    field: 'Astronomia',
    period: 'Terra e Sol',
    readingTime: 4,
    confidence: 88,
    confidenceLabel: '3 referências abertas listadas · revisão editorial humana pendente',
    summary:
      'Mesmo viajando à velocidade da luz, a energia que vemos hoje saiu do Sol cerca de oito minutos antes.',
    fact: 'A luz solar leva aproximadamente 8 minutos e 20 segundos para percorrer a distância média entre o Sol e a Terra.',
    detail:
      'A luz não chega instantaneamente: ela se propaga no espaço a cerca de 300 mil quilômetros por segundo. Como a distância média entre a Terra e o Sol é próxima de 150 milhões de quilômetros, a viagem leva pouco mais de oito minutos. A distância Terra–Sol varia ao longo do ano, então o tempo exato também varia um pouco. Por isso, observar o Sol é vê-lo como era alguns minutos atrás — nunca olhe diretamente para ele.',
    sourceCount: 3,
    sources: [
      {
        name: 'NASA — Time Travel: Observing Cosmic History',
        url: 'https://science.nasa.gov/mission/hubble/science/science-behind-the-discoveries/time-travel-observing-cosmic-history/',
        kind: 'Agência espacial · explicação educacional',
      },
      {
        name: 'OpenStax — Astronomy 2e: A Tour of the Universe',
        url: 'https://openstax.org/books/astronomy-2e/pages/1-6-a-tour-of-the-universe',
        kind: 'Livro didático aberto · Rice University',
      },
      {
        name: 'UCAR Center for Science Education — The Sun’s Energy',
        url: 'https://scied.ucar.edu/learning-zone/earth-system/energy-from-sun',
        kind: 'Centro universitário de educação científica',
      },
    ],
    tags: ['Sol', 'Terra', 'luz', 'distância', 'sistema solar'],
    relatedTopics: ['venus', 'mars-sol'],
  },
  {
    id: 'astronomical-unit',
    title: 'A unidade astronômica tem um valor definido com exatidão',
    field: 'Astronomia',
    period: 'Como medimos o espaço',
    readingTime: 4,
    confidence: 88,
    confidenceLabel: '3 referências abertas listadas · revisão editorial humana pendente',
    summary:
      'A unidade astronômica facilita comparar distâncias no sistema solar, mas não significa que a órbita terrestre seja um círculo perfeito.',
    fact: 'Desde a definição adotada pela União Astronômica Internacional, 1 au corresponde exatamente a 149.597.870.700 metros.',
    detail:
      'A unidade astronômica (au) é uma unidade de comprimento útil para falar das distâncias dentro do sistema solar. Seu valor atual é fixado exatamente em metros. Historicamente, ela estava ligada à distância média entre a Terra e o Sol; hoje, essa relação serve como aproximação intuitiva, não como definição geométrica da distância real em cada instante. A órbita da Terra é ligeiramente elíptica, então a distância ao Sol muda durante o ano.',
    sourceCount: 3,
    sources: [
      {
        name: 'União Astronômica Internacional — Measuring the Universe',
        url: 'https://iauarchive.eso.org/public/themes/measuring/',
        kind: 'Organização científica internacional · definição da unidade',
      },
      {
        name: 'NASA/JPL CNEOS — Astronomical Unit',
        url: 'https://cneos.jpl.nasa.gov/glossary/au.html',
        kind: 'Centro de estudos de objetos próximos à Terra · NASA/JPL',
      },
      {
        name: 'OpenStax — Astronomy 2e: Fundamental Units of Distance',
        url: 'https://openstax.org/books/astronomy-2e/pages/19-1-fundamental-units-of-distance',
        kind: 'Livro didático aberto · Rice University',
      },
    ],
    tags: ['unidades', 'distância', 'Terra', 'Sol', 'astronomia'],
    relatedTopics: ['sunlight-travel-time', 'venus'],
  },
  {
    id: 'earth-seasons-tilt',
    title: 'A inclinação da Terra explica as estações do ano',
    field: 'Astronomia',
    period: 'Movimentos da Terra',
    readingTime: 5,
    confidence: 88,
    confidenceLabel: '3 referências abertas listadas · revisão editorial humana pendente',
    summary:
      'A inclinação do eixo terrestre muda o ângulo e a duração da luz solar recebida por cada hemisfério ao longo do ano.',
    fact: 'As estações acontecem principalmente pela inclinação do eixo da Terra, não por o planeta estar muito mais perto ou mais longe do Sol.',
    detail:
      'Enquanto a Terra percorre sua órbita, seu eixo permanece inclinado em relação ao plano orbital. Durante parte do ano, um hemisfério recebe luz mais direta e tem dias mais longos; seis meses depois, o outro hemisfério fica mais voltado para o Sol. Isso produz estações opostas nos dois hemisférios. A distância da Terra ao Sol também varia: no hemisfério norte, a Terra fica mais próxima em janeiro, durante o inverno. Essa variação não é a causa principal das estações.',
    sourceCount: 3,
    sources: [
      {
        name: 'NOAA NESDIS — Why Does Earth Have Seasons?',
        url: 'https://www.nesdis.noaa.gov/about/k-12-education/understanding-our-planet/why-does-earth-have-seasons',
        kind: 'Agência pública de clima e satélites · material educacional',
      },
      {
        name: 'NASA Science — Seasons on Earth, Mars, and Beyond',
        url: 'https://science.nasa.gov/helio-and-you-seasons-on-earth-mars-and-beyond/',
        kind: 'Agência espacial · explicação e comparação planetária',
      },
      {
        name: 'OpenStax — Astronomy 2e: The Seasons',
        url: 'https://openstax.org/books/astronomy-2e/pages/4-2-the-seasons',
        kind: 'Livro didático aberto · Rice University',
      },
    ],
    tags: ['Terra', 'estações', 'eixo', 'órbita', 'Sol'],
    relatedTopics: ['sunlight-travel-time', 'astronomical-unit', 'mars-sol'],
  },
];
