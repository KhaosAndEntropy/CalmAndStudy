import type { Topic } from '../types';

export const humanitiesTopics: Topic[] = [
  {
    id: 'antikythera',
    title: 'O computador perdido dos antigos gregos',
    field: 'História',
    period: 'c. 150–100 a.C.',
    readingTime: 4,
    confidence: 96,
    confidenceLabel: 'Muito bem documentado',
    summary:
      'Um mecanismo de bronze encontrado num naufrágio mudou o que imaginávamos sobre a tecnologia antiga.',
    fact: 'Com engrenagens cuidadosamente encaixadas, o mecanismo de Anticítera previa eclipses e acompanhava ciclos astronômicos — cerca de dois mil anos antes dos relógios mecânicos europeus.',
    detail:
      'O objeto foi recuperado por mergulhadores de esponjas em 1901, num naufrágio romano perto da ilha grega de Anticítera. Tomografias modernas revelaram dezenas de engrenagens e inscrições. Pesquisadores ainda debatem alguns detalhes de sua construção e uso, mas sua função como calculadora astronômica é sustentada por evidências materiais e estudos independentes.',
    sourceCount: 4,
    sources: [
      {
        name: 'Museu Arqueológico Nacional da Grécia',
        url: 'https://www.namuseum.gr/en/collection/bronze-statues/',
        kind: 'Acervo',
      },
      {
        name: 'Nature — The Antikythera Mechanism',
        url: 'https://www.nature.com/articles/444534a',
        kind: 'Pesquisa revisada por pares',
      },
      {
        name: 'UCL — A Model of the Cosmos',
        url: 'https://www.ucl.ac.uk/news/2021/mar/antikythera-mechanism-reveals-ancient-greek-knowledge',
        kind: 'Universidade',
      },
      {
        name: 'Smithsonian Magazine',
        url: 'https://www.smithsonianmag.com/history/what-we-know-about-the-antikythera-mechanism-180979293/',
        kind: 'Divulgação',
      },
    ],
    tags: ['astronomia', 'arqueologia', 'tecnologia'],
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Antikythera_mechanism_back_view%2C_1st-2nd_century_BC%2C_Greece_%28transparent_model%29.jpg/960px-Antikythera_mechanism_back_view%2C_1st-2nd_century_BC%2C_Greece_%28transparent_model%29.jpg',
      alt: 'Reconstrução transparente do mecanismo de Anticítera',
      credit: 'Gts-tg · CC BY-SA 4.0',
      creditUrl:
        'https://commons.wikimedia.org/wiki/File:Antikythera_mechanism_back_view,_1st-2nd_century_BC,_Greece_(transparent_model).jpg',
    },
  },
  {
    id: 'silk',
    title: 'A Rota da Seda nunca foi uma única estrada',
    field: 'História',
    period: 'séculos II a.C. – XV',
    readingTime: 5,
    confidence: 91,
    confidenceLabel: 'Bem documentado',
    summary: 'Uma rede de rotas conectou cidades, ideias e pessoas por milhares de quilômetros.',
    fact: 'O nome “Rota da Seda” é moderno. Na Antiguidade, mercadores usavam uma rede mutável de caminhos terrestres e marítimos entre a Ásia, África e Europa.',
    detail:
      'Em vez de uma estrada contínua, caravanas e embarcações percorriam trechos que conectavam mercados e impérios. Seda era apenas uma entre muitas mercadorias; religiões, técnicas, doenças e conhecimentos também circularam. A importância de cada rota variou conforme clima, política e segurança.',
    sourceCount: 3,
    sources: [
      {
        name: 'UNESCO Silk Roads Programme',
        url: 'https://www.unesco.org/en/silkroads',
        kind: 'Organização internacional',
      },
      {
        name: 'The Met — Trade between the Romans and the Empires of Asia',
        url: 'https://www.metmuseum.org/essays/trade-between-the-romans-and-the-empires-of-asia',
        kind: 'Museu',
      },
      {
        name: 'Smithsonian National Museum of Asian Art — Silk Road',
        url: 'https://asia.si.edu/glossary/silk-road/',
        kind: 'Museu e acervo público',
      },
    ],
    tags: ['comércio', 'geografia', 'intercâmbio cultural'],
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/3/37/Silk_Road_in_the_I_century_AD_-_en.svg',
      alt: 'Mapa das rotas da Seda e outras rotas de caravanas no século I',
      credit: 'Kaidor · CC BY-SA 4.0',
      creditUrl: 'https://commons.wikimedia.org/wiki/File:Silk_Road_in_the_I_century_AD_-_en.svg',
    },
  },
  {
    id: 'homo-sapiens-africa',
    title: 'Nossa espécie surgiu na África há cerca de 300 mil anos',
    field: 'Antropologia',
    period: 'Evolução humana',
    readingTime: 4,
    confidence: 91,
    confidenceLabel: 'Evidências fósseis e genéticas',
    summary:
      'Fósseis, genética e arqueologia ajudam a reconstruir uma história humana longa e ramificada.',
    fact: 'O Smithsonian situa o surgimento de Homo sapiens na África há aproximadamente 300 mil anos.',
    detail:
      'A data é aproximada e descreve evidências atuais, não um instante único de origem. A evolução humana envolveu populações e mudanças ao longo do tempo. Estudos combinam fósseis, ferramentas, genética e outros vestígios; novas descobertas podem refinar a cronologia e os modelos de migração.',
    sourceCount: 1,
    sources: [
      {
        name: 'Smithsonian Human Origins Program — Homo sapiens',
        url: 'https://humanorigins.si.edu/evidence/human-fossils/species/homo-sapiens',
        kind: 'Museu e programa de pesquisa · fósseis e evolução',
      },
    ],
    tags: ['evolução humana', 'fósseis', 'África', 'genética'],
  },
  {
    id: 'cuneiform-writing',
    title: 'A escrita cuneiforme começou na antiga Suméria',
    field: 'História',
    period: 'c. 3200 a.C.',
    readingTime: 4,
    confidence: 89,
    confidenceLabel: 'Acervo e bibliografia especializada',
    summary:
      'Marcas em tabuletas de argila evoluíram para um sistema complexo usado por diferentes povos.',
    fact: 'O sistema cuneiforme sumério já havia se desenvolvido por volta de 3200 a.C.; seus sinais foram usados em registros e textos por milênios.',
    detail:
      '“Cuneiforme” descreve a forma de cunha das marcas feitas com estiletes na argila. As primeiras tabuletas estão associadas a práticas administrativas, mas a história do sistema é mais complexa do que uma invenção instantânea para contabilidade. A escrita foi adaptada por várias línguas e culturas da região.',
    sourceCount: 3,
    sources: [
      {
        name: 'The Met — The Origins of Writing',
        url: 'https://www.metmuseum.org/essays/the-origins-of-writing',
        kind: 'Museu · ensaio de especialista e acervo',
      },
      {
        name: 'British Museum — Mesopotamia: writing and cuneiform',
        url: 'https://www.britishmuseum.org/sites/default/files/2019-09/Visit_Mesopotamia_KS2b.pdf',
        kind: 'Museu · material educativo de acesso aberto',
      },
      {
        name: 'University College London — Cuneiform',
        url: 'https://www.ucl.ac.uk/museums-static/digitalegypt/writing/cuneiform.html',
        kind: 'Universidade · recurso acadêmico aberto',
      },
    ],
    tags: ['escrita', 'Suméria', 'arqueologia', 'Mesopotâmia'],
  },
  {
    id: 'stone-tools',
    title: 'Ferramentas de pedra preservam pistas sobre os primeiros humanos',
    field: 'Arqueologia',
    period: 'pelo menos 2,6 milhões de anos',
    readingTime: 4,
    confidence: 90,
    confidenceLabel: 'Evidência arqueológica institucional',
    summary:
      'Artefatos líticos registram técnicas e ocupações que raramente deixam outros vestígios duráveis.',
    fact: 'O Smithsonian situa o desenvolvimento da fabricação de ferramentas de pedra há pelo menos 2,6 milhões de anos.',
    detail:
      'Lascas, núcleos e ferramentas maiores ajudam a estudar tecnologia, destreza e modos de vida. Como várias espécies de hominínios coexistiram em alguns períodos, encontrar uma ferramenta num sítio não identifica automaticamente quem a fabricou. Arqueólogos combinam camadas, datação, marcas de uso e outros fósseis para construir interpretações, que podem mudar com novas descobertas.',
    sourceCount: 2,
    sources: [
      {
        name: 'Smithsonian Human Origins — Stone Tools',
        url: 'https://humanorigins.si.edu/evidence/behavior/stone-tools',
        kind: 'Programa de pesquisa e coleção arqueológica',
      },
      {
        name: 'Smithsonian Human Origins — Tools & Food',
        url: 'https://humanorigins.si.edu/human-characteristics/tools-food',
        kind: 'Programa de pesquisa · tecnologia e subsistência',
      },
    ],
    tags: ['arqueologia', 'evolução humana', 'ferramentas', 'fósseis'],
    recommendedBefore: [
      {
        topicId: 'homo-sapiens-africa',
        title: 'Nossa espécie surgiu na África há cerca de 300 mil anos',
        why: 'Esse artigo situa Homo sapiens; as ferramentas de pedra aqui tratadas são muito mais antigas e podem ter sido feitas por outras espécies humanas.',
      },
    ],
  },
  {
    id: 'measuring-inflation',
    title: 'A inflação é medida por índices, não por um preço isolado',
    field: 'Economia',
    period: 'Estatística econômica',
    readingTime: 5,
    confidence: 92,
    confidenceLabel: 'Definição estatística e livro aberto',
    summary:
      'Índices de preços acompanham a variação de uma cesta representativa ao longo do tempo.',
    fact: 'O Índice de Preços ao Consumidor mede a mudança média de preços de uma cesta definida para uma população específica.',
    detail:
      'Um índice como o CPI dos Estados Unidos acompanha preços de bens e serviços e combina variações com pesos de consumo. Ele ajuda a resumir tendências, mas não mede perfeitamente o gasto de cada família: cestas, regiões e hábitos diferem. Também não deve ser usado para concluir que uma cidade é mais cara que outra apenas comparando índices locais. Outros países, incluindo o Brasil, calculam seus próprios índices e usam cestas e metodologias próprias.',
    sourceCount: 2,
    sources: [
      {
        name: 'U.S. Bureau of Labor Statistics — CPI Questions and Answers',
        url: 'https://www.bls.gov/cpi/questions-and-answers.htm',
        kind: 'Agência estatística · definição e limites',
      },
      {
        name: 'OpenStax — Macroeconomics',
        url: 'https://openstax.org/books/principles-finance/pages/3-2-macroeconomics',
        kind: 'Livro universitário aberto · inflação',
      },
    ],
    tags: ['inflação', 'preços', 'estatística', 'economia'],
    relatedTopics: ['logarithmic-scales'],
  },
  {
    id: 'agriculture-many-origins',
    title: 'A agricultura surgiu em várias regiões, em processos distintos',
    field: 'Antropologia',
    period: 'Transição para cultivo e domesticação',
    readingTime: 5,
    confidence: 90,
    confidenceLabel: 'Síntese arqueobotânica e histórica',
    summary:
      'Cultivar plantas e domesticar espécies não foi uma invenção única que se espalhou pronta pelo mundo.',
    fact: 'Evidências apontam para processos independentes de cultivo e domesticação em diferentes regiões, ao longo de milênios.',
    detail:
      'O início da agricultura não foi um evento único nem uma mudança instantânea. Comunidades passaram a manejar plantas e animais em tempos e lugares distintos; em alguns casos, o cultivo começou antes de as espécies exibirem mudanças físicas claras associadas à domesticação. No Crescente Fértil, nos trópicos americanos e em outras regiões, arqueólogos combinam restos vegetais, pólen, genética, ferramentas e sítios. “Revolução agrícola” pode esconder ritmos locais, períodos de convivência com caça e coleta e debates sobre quando chamar uma prática de agricultura.',
    sourceCount: 3,
    sources: [
      {
        name: 'Smithsonian Profiles — The Origins of Agriculture in the Near East',
        url: 'https://profiles.si.edu/display/sro_109973',
        kind: 'Perfil de pesquisa · artigo acadêmico e resumo aberto',
      },
      {
        name: 'Smithsonian Profiles — Plant Cultivation in the New World Tropics',
        url: 'https://profiles.si.edu/display/sro_105636',
        kind: 'Perfil de pesquisa · artigo acadêmico e resumo aberto',
      },
      {
        name: 'FAO — The State of the World’s Plant Genetic Resources',
        url: 'https://www.fao.org/4/w7324e/w7324e.pdf',
        kind: 'Relatório público da Organização das Nações Unidas para Alimentação e Agricultura',
      },
    ],
    tags: ['agricultura', 'domesticação', 'arqueologia', 'plantas', 'sociedades'],
    recommendedBefore: [
      {
        topicId: 'stone-tools',
        title: 'Ferramentas de pedra preservam pistas sobre os primeiros humanos',
        why: 'As ferramentas ajudam a imaginar modos de vida anteriores à produção de alimentos; essa leitura avança para a transição ao cultivo.',
      },
    ],
  },
  {
    id: 'rosetta-decipherment',
    title: 'A Pedra de Roseta foi uma chave para ler hieróglifos',
    field: 'Linguística',
    period: 'Decreto de 196 a.C. · decifração em 1822',
    readingTime: 5,
    confidence: 92,
    confidenceLabel: 'Objeto histórico e pesquisa universitária aberta',
    summary:
      'Um decreto em dois idiomas e três sistemas de escrita permitiu comparar sinais egípcios com o grego conhecido.',
    fact: 'A pedra traz o mesmo decreto em hieróglifos, escrita demótica e grego antigo; ela ajudou Champollion a publicar avanços decisivos em 1822.',
    detail:
      'O texto não era uma tradução palavra por palavra simples: hieróglifos e demótico registravam o egípcio, enquanto o grego fornecia um ponto de comparação para o decreto. Pesquisadores como Thomas Young contribuíram antes de Champollion identificar valores fonéticos e relacionar escritas. A pedra foi uma pista crucial, mas a leitura dos hieróglifos também dependeu do conhecimento de outras inscrições, da língua copta e de trabalho filológico posterior.',
    sourceCount: 2,
    sources: [
      {
        name: 'Leipzig University — The Rosetta Stone',
        url: 'https://rosetta-stone.dh.uni-leipzig.de/rs/the-rosetta-stone/index.html',
        kind: 'Projeto acadêmico de humanidades digitais',
      },
      {
        name: 'German Digital Library — The Rosetta Stone and the Decipherment',
        url: 'https://ausstellungen.deutsche-digitale-bibliothek.de/rosetta-stone',
        kind: 'Exposição digital de instituições culturais e universidades',
      },
    ],
    tags: ['Egito antigo', 'escrita', 'tradução', 'arqueologia', 'línguas'],
    recommendedBefore: [
      {
        topicId: 'cuneiform-writing',
        title: 'A escrita cuneiforme começou na antiga Suméria',
        why: 'A leitura anterior mostra que sistemas de escrita podem ser adaptados a várias línguas; a Pedra de Roseta ilustra como comparar escritas antigas.',
      },
    ],
  },
];
