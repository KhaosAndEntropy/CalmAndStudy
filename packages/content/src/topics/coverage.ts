import type { Topic } from '../types';

type Seed = Pick<
  Topic,
  'id' | 'title' | 'field' | 'period' | 'summary' | 'fact' | 'detail' | 'tags'
> & {
  source: string;
  url: string;
  sourceKind?: string;
  source2?: string;
  url2?: string;
};

/**
 * First editorial pass for fields that had no article in the original catalogue.
 * Each text is an original, introductory synthesis; source links are free to read.
 * The displayed percentage remains explicitly demonstrative until an editorial
 * record with claim-level evidence and human review is attached.
 */
const seeds: Seed[] = [
  {
    id: 'geography-patterns',
    title: 'A geografia estuda relações entre lugares e pessoas',
    field: 'Geografia',
    period: 'Conceitos fundamentais',
    summary:
      'A disciplina conecta características físicas da Terra com a distribuição das sociedades e suas atividades.',
    fact: 'A geografia combina perguntas sobre ambiente, localização, espaço e relações humanas; mapas são uma das ferramentas, não o campo inteiro.',
    detail:
      'Uma pergunta geográfica pode investigar por que cidades crescem junto a rios, como uma espécie se distribui ou de que modo uma fronteira afeta deslocamentos. Geógrafos trabalham em escalas diferentes, do bairro ao planeta, e cruzam mapas com observações, dados e relatos. A mesma distribuição pode ter causas naturais e sociais ao mesmo tempo; por isso, proximidade num mapa não prova causalidade.',
    source: 'National Geographic Education — Geography',
    url: 'https://education.nationalgeographic.org/resource/geography-article/',
    tags: ['espaço', 'lugares', 'sociedade', 'mapas'],
  },
  {
    id: 'ecosystem-energy',
    title: 'Energia flui pelos ecossistemas; matéria é reciclada',
    field: 'Ecologia',
    period: 'Ecologia de ecossistemas',
    summary:
      'Organismos se relacionam por redes alimentares e dependem tanto de energia quanto da circulação de nutrientes.',
    fact: 'A energia disponível costuma diminuir entre níveis tróficos, enquanto elementos químicos podem circular entre organismos e ambiente.',
    detail:
      'Uma cadeia alimentar mostra um caminho simplificado; uma teia alimentar representa várias relações simultâneas. Plantas, algas e alguns microrganismos capturam energia, consumidores a obtêm ao se alimentar e decompositores transformam matéria orgânica. A energia não retorna ao ecossistema em ciclo fechado: parte se dissipa como calor. Nutrientes como carbono e nitrogênio, por outro lado, podem circular repetidamente entre seres vivos, solo, água e atmosfera.',
    source: 'OpenStax Biology 2e — Ecology of Ecosystems',
    url: 'https://openstax.org/books/biology-2e/pages/46-1-ecology-of-ecosystems',
    tags: ['ecossistemas', 'energia', 'cadeia alimentar', 'nutrientes'],
  },
  {
    id: 'neuron-signals',
    title: 'Neurônios transformam sinais em atividade coordenada',
    field: 'Neurociência',
    period: 'Sistema nervoso',
    summary:
      'Células nervosas recebem, integram e transmitem sinais por processos elétricos e químicos.',
    fact: 'Na sinapse química, a chegada de um sinal pode levar à liberação de mensageiros que influenciam a célula seguinte.',
    detail:
      'Um neurônio possui regiões especializadas para receber sinais, integrar atividade e conduzir impulsos. Em muitas sinapses, neurotransmissores atravessam um pequeno espaço e se ligam a receptores, alterando a chance de a célula seguinte produzir sua própria resposta. A comunicação não é um fio simples nem sempre excitadora: há sinais inibitórios, circuitos paralelos e interação constante com células gliais. Essa descrição é uma introdução, não explica sozinha pensamentos ou comportamentos complexos.',
    source: 'OpenStax Anatomy and Physiology 2e — Nervous Tissue',
    url: 'https://openstax.org/books/anatomy-and-physiology-2e/pages/12-2-nervous-tissue',
    tags: ['neurônios', 'sinapses', 'cérebro', 'sinais'],
  },
  {
    id: 'names-in-logic',
    title: 'A lógica também examina nomes sem referente',
    field: 'Filosofia',
    period: 'Lógica filosófica contemporânea',
    summary:
      'Algumas teorias lógicas estudam como raciocinar sobre personagens, objetos possíveis ou nomes que não apontam para algo existente.',
    fact: 'A lógica livre modifica regras clássicas para permitir termos singulares que podem não denotar um objeto existente.',
    detail:
      'Na lógica clássica usual, os nomes de uma fórmula são tratados como se designassem elementos do domínio. Mas frases comuns incluem nomes vazios, como personagens fictícios, e enunciados sobre coisas que poderiam existir. A lógica livre investiga como preservar inferências cuidadosas nesses casos. Ela não é uma única solução para todos os problemas da linguagem: há versões diferentes e debates sobre como interpretar existência, referência e verdade.',
    source: 'Stanford Encyclopedia of Philosophy — Free Logic',
    url: 'https://plato.stanford.edu/entries/logic-free/',
    tags: ['filosofia', 'lógica', 'linguagem', 'existência'],
  },
  {
    id: 'art-history-context',
    title: 'Uma obra de arte também conta histórias de lugares e épocas',
    field: 'Arte',
    period: 'História da arte',
    summary:
      'A leitura de objetos artísticos ganha contexto quando combina datação, local, materiais, função e circulação.',
    fact: 'O Met organiza estudos de história da arte por cronologia, geografia e temas, além de relacioná-los a objetos de sua coleção.',
    detail:
      'Uma obra não fala sozinha: sua interpretação pode mudar quando se conhece quem a produziu, para quem, com quais materiais e em que contexto político ou ritual. Museus combinam análise material, documentação, comparação e pesquisa histórica; atribuições e datas podem ser revistas quando surgem novas evidências. Categorias como “arte” e “estilo” também variam entre culturas, então uma linha do tempo é uma ferramenta de orientação, não uma hierarquia universal.',
    source: 'The Metropolitan Museum of Art — Heilbrunn Timeline of Art History',
    url: 'https://www.metmuseum.org/met-publications/heilbrunn-timeline-of-art-history',
    tags: ['arte', 'história', 'museus', 'contexto'],
  },
  {
    id: 'exoplanet-methods',
    title: 'Muitos planetas distantes são encontrados indiretamente',
    field: 'Astrofísica',
    period: 'Estudo de sistemas planetários',
    summary:
      'A luz de uma estrela pode revelar a presença de um planeta mesmo quando não conseguimos fotografá-lo diretamente.',
    fact: 'Trânsitos e oscilações da estrela estão entre os métodos usados para detectar e caracterizar exoplanetas.',
    detail:
      'No método do trânsito, um planeta passa diante de sua estrela e causa uma pequena queda periódica no brilho observado. No método da velocidade radial, a atração gravitacional do planeta produz um movimento minúsculo na estrela, detectável por mudanças em seu espectro. Cada técnica tem limites e favorece certos tipos de sistema. Uma detecção não significa que o planeta seja habitável: tamanho, órbita e sinais atmosféricos precisam ser estudados com outras observações.',
    source: 'NASA Science — Exoplanets',
    url: 'https://science.nasa.gov/exoplanets/',
    tags: ['estrelas', 'planetas', 'trânsito', 'observação'],
  },
  {
    id: 'cosmic-background',
    title: 'A radiação cósmica de fundo guarda um retrato do universo jovem',
    field: 'Cosmologia',
    period: 'Cosmologia observacional',
    summary:
      'Uma luz muito antiga permite testar modelos sobre a evolução em grande escala do universo.',
    fact: 'A radiação cósmica de fundo foi liberada quando o universo jovem se tornou transparente à luz, cerca de 380 mil anos após o Big Bang.',
    detail:
      'Antes dessa época, elétrons livres espalhavam fótons com frequência. Quando o universo esfriou o suficiente para formar átomos neutros, a luz pôde viajar por longas distâncias. A expansão cósmica esticou seus comprimentos de onda até a faixa de micro-ondas que observamos hoje. Pequenas variações nessa radiação ajudam a estimar propriedades do universo, mas sua interpretação depende de modelos e medições; não é uma fotografia de uma explosão ocorrida em um ponto do espaço.',
    source: 'NASA Science — Overview of the Universe',
    url: 'https://science.nasa.gov/universe/overview/',
    tags: ['universo', 'Big Bang', 'radiação', 'cosmologia'],
  },
  {
    id: 'astrobiology-life-search',
    title: 'Astrobiologia procura sinais de vida sem presumir que já a encontrou',
    field: 'Astrobiologia',
    period: 'Pesquisa sobre vida no universo',
    summary:
      'A área combina astronomia, química, geologia e biologia para estudar condições e possíveis sinais de vida.',
    fact: 'A NASA informa que ainda não há evidências de vida além da Terra; a busca científica investiga ambientes e possíveis sinais.',
    detail:
      'Pesquisadores estudam ambientes extremos terrestres, antigos rios em Marte, oceanos sob luas geladas e atmosferas de exoplanetas. Essas linhas ajudam a definir quais sinais poderiam ser produzidos por processos biológicos e quais também podem surgir sem vida. Encontrar uma molécula isolada não bastaria: seria preciso avaliar contexto, instrumentos, explicações alternativas e confirmação independente. A ausência de detecção confirmada não demonstra que a vida extraterrestre seja impossível.',
    source: 'NASA Science — Are We Alone?',
    url: 'https://science.nasa.gov/exoplanets/search-for-life/',
    tags: ['vida', 'planetas', 'biossinais', 'habitabilidade'],
  },
  {
    id: 'quantum-light',
    title: 'A luz pode revelar comportamentos que a física clássica não prevê',
    field: 'Física Quântica',
    period: 'Física moderna',
    summary:
      'Experimentos com luz e matéria mostram resultados quantizados e relações probabilísticas em escala microscópica.',
    fact: 'A física quântica descreve fenômenos que não podem ser explicados apenas pelas leis clássicas da mecânica e do eletromagnetismo.',
    detail:
      'Em certos experimentos, a luz transfere energia em pacotes chamados fótons; em outros, padrões de interferência revelam seu comportamento ondulatório. A teoria quântica prevê resultados com probabilidades e foi testada em diversos contextos, de espectros atômicos a dispositivos eletrônicos. Isso não significa que “qualquer coisa pode acontecer”: as probabilidades seguem regras matemáticas muito restritas. A interpretação do que a teoria diz sobre a realidade continua sendo tema de discussão filosófica e física.',
    source: 'OpenStax Physics — Preface and coverage',
    url: 'https://openstax.org/books/physics/pages/preface',
    tags: ['fótons', 'quantização', 'experimentos', 'física moderna'],
  },
  {
    id: 'optics-images',
    title: 'Lentes formam imagens ao desviar e reunir a luz',
    field: 'Óptica',
    period: 'Óptica geométrica',
    summary:
      'A forma e o material de uma lente mudam o caminho dos raios luminosos e podem ampliar ou reduzir uma imagem.',
    fact: 'A refração acontece quando a luz muda de velocidade ao passar entre materiais e altera sua direção.',
    detail:
      'Lentes convergentes aproximam raios paralelos e podem formar imagens reais ou virtuais, dependendo da posição do objeto. Lentes divergentes espalham os raios e, em condições comuns, produzem imagens virtuais menores. Os diagramas de raios são modelos úteis, mas lentes reais têm limitações, como aberrações e perdas de luz. Óculos, câmeras, microscópios e telescópios aplicam princípios de óptica em combinações distintas.',
    source: 'OpenStax Physics — Refraction',
    url: 'https://openstax.org/books/physics/pages/16-2-refraction',
    tags: ['luz', 'lentes', 'refração', 'imagem'],
  },
  {
    id: 'thermodynamics-energy',
    title: 'Termodinâmica acompanha energia, calor e trabalho',
    field: 'Termodinâmica',
    period: 'Leis da termodinâmica',
    summary:
      'A área descreve como energia se transfere e se transforma em sistemas físicos e químicos.',
    fact: 'A primeira lei da termodinâmica expressa a conservação da energia: a mudança de energia interna depende do calor e do trabalho transferidos.',
    detail:
      'Calor é energia em trânsito devido a uma diferença de temperatura; não é uma substância armazenada dentro de um objeto. Trabalho também pode transferir energia, por exemplo quando um gás se expande contra uma pressão. Em química, a entalpia ajuda a acompanhar trocas de calor sob pressão constante. A segunda lei acrescenta que processos espontâneos têm direção e aumentam a entropia total. Nenhuma dessas leis diz que energia pode ser criada do nada.',
    source: 'OpenStax Chemistry 2e — Enthalpy',
    url: 'https://openstax.org/books/chemistry-2e/pages/5-3-enthalpy',
    tags: ['energia', 'calor', 'trabalho', 'entropia'],
  },
  {
    id: 'nuclear-fission-basics',
    title: 'Na fissão nuclear, um núcleo pesado se divide',
    field: 'Física Nuclear',
    period: 'Reações nucleares',
    summary:
      'A divisão de certos núcleos pode liberar energia e nêutrons que iniciam outras reações.',
    fact: 'Na fissão, um núcleo atômico se parte em núcleos menores e outras partículas; em algumas condições, nêutrons liberados sustentam uma reação em cadeia.',
    detail:
      'A fissão pode ser induzida pela absorção de um nêutron ou ocorrer espontaneamente em certos núcleos instáveis. Em um reator, materiais, geometria e absorvedores são controlados para regular a reação; calor gerado pode produzir vapor e mover turbinas. Fissão não é fusão: na fusão, núcleos leves se combinam. Os riscos dependem do projeto, da operação, dos resíduos e das medidas de segurança, por isso o mecanismo físico não basta para avaliar uma política energética.',
    source: 'U.S. Department of Energy — DOE Explains Nuclear Fission',
    url: 'https://www.energy.gov/science/doe-explainsnuclear-fission',
    tags: ['núcleo', 'nêutrons', 'energia', 'reatores'],
  },
  {
    id: 'materials-structure',
    title: 'A estrutura interna ajuda a explicar as propriedades dos materiais',
    field: 'Ciência dos Materiais',
    period: 'Estrutura, processamento e propriedades',
    summary:
      'Composição e organização em várias escalas influenciam resistência, condução, flexibilidade e outras características.',
    fact: 'Engenharia de materiais relaciona composição, estrutura, processamento e desempenho para selecionar ou projetar materiais.',
    detail:
      'Do arranjo dos átomos aos defeitos microscópicos e à forma de uma peça, diferentes escalas afetam o comportamento de um material. Tratamentos térmicos, deformação e fabricação podem alterar a estrutura sem mudar a composição química nominal. Por isso, “mais resistente” não descreve um material em todos os usos: dureza, tenacidade, peso, corrosão, custo e temperatura de operação podem entrar em conflito. A escolha adequada depende da aplicação e de ensaios.',
    source: 'NIST — Materials Science and Engineering',
    url: 'https://www.nist.gov/mml/materials-science-and-engineering-division',
    tags: ['materiais', 'estrutura', 'propriedades', 'engenharia'],
  },
  {
    id: 'biophysics-scale',
    title: 'A biofísica conecta escalas da molécula ao organismo',
    field: 'Biofísica',
    period: 'Métodos interdisciplinares',
    summary:
      'Princípios físicos ajudam a explicar movimento, fluxo, sinais e organização em sistemas vivos.',
    fact: 'A biofísica aplica conceitos e ferramentas da física para investigar sistemas biológicos.',
    detail:
      'Uma pergunta biofísica pode medir como proteínas mudam de forma, como íons atravessam membranas ou como forças atuam em músculos. Experimentos frequentemente combinam microscopia, modelagem matemática e medições quantitativas. Um modelo simplifica o sistema para testar mecanismos, mas seus resultados dependem das hipóteses e das condições usadas. A vida também envolve história evolutiva e interação entre níveis de organização, portanto uma explicação física não substitui os demais enfoques biológicos.',
    source: 'OpenStax Biology 2e — Biology and its themes',
    url: 'https://openstax.org/books/biology-2e/pages/1-2-themes-and-concepts-of-biology',
    tags: ['física', 'biologia', 'moléculas', 'modelagem'],
  },
  {
    id: 'biochemistry-enzymes',
    title: 'Enzimas aceleram reações sem serem consumidas nelas',
    field: 'Bioquímica',
    period: 'Proteínas e metabolismo',
    summary:
      'Reações químicas sustentam as células, e enzimas ajudam a controlar sua velocidade e especificidade.',
    fact: 'Uma enzima reduz a energia de ativação de uma reação; ela não altera por si só a diferença de energia entre reagentes e produtos.',
    detail:
      'O sítio ativo de uma enzima interage com moléculas específicas e favorece uma rota de reação. Temperatura, pH e concentração podem alterar a atividade, e algumas enzimas precisam de cofatores. A enzima participa do processo, mas é regenerada ao final de cada ciclo catalítico. Isso não torna uma reação ilimitada: disponibilidade de substrato, regulação celular e condições químicas restringem o fluxo metabólico.',
    source: 'OpenStax Biology 2e — Energy and Metabolism',
    url: 'https://openstax.org/books/biology-2e/pages/6-1-energy-and-metabolism',
    tags: ['enzimas', 'proteínas', 'metabolismo', 'reações'],
  },
  {
    id: 'molecular-dna-rna',
    title: 'DNA e RNA guardam e transmitem informação celular',
    field: 'Biologia Molecular',
    period: 'Ácidos nucleicos',
    summary:
      'As sequências de nucleotídeos participam do armazenamento, da leitura e da regulação da informação genética.',
    fact: 'DNA e RNA são ácidos nucleicos formados por nucleotídeos, mas têm diferenças estruturais e funções que se sobrepõem apenas em parte.',
    detail:
      'O DNA costuma formar uma dupla hélice com pares de bases complementares. Em muitos sistemas celulares, trechos do DNA são transcritos em RNA, e alguns RNAs participam da produção de proteínas; outros regulam processos ou têm funções estruturais. A expressão de um gene depende de redes de controle e do contexto da célula. Assim, dizer que um gene “determina” sozinho uma característica complexa costuma simplificar demais a biologia.',
    source: 'OpenStax Biology 2e — Nucleic Acids',
    url: 'https://openstax.org/books/biology-2e/pages/3-5-nucleic-acids',
    tags: ['DNA', 'RNA', 'genes', 'nucleotídeos'],
  },
  {
    id: 'cell-basic-unit',
    title: 'Células são unidades organizadas, não simples sacos de moléculas',
    field: 'Biologia Celular',
    period: 'Organização celular',
    summary:
      'Membranas, organelas e redes bioquímicas criam compartimentos que mantêm e coordenam funções celulares.',
    fact: 'Todas as células conhecidas possuem membrana plasmática, material genético e processos de transformação de energia, embora variem muito em estrutura.',
    detail:
      'Células procarióticas não têm núcleo delimitado por membrana; células eucarióticas organizam o DNA no núcleo e possuem compartimentos especializados. A membrana regula trocas com o ambiente, enquanto ribossomos produzem proteínas e outras estruturas participam de diferentes tarefas. Nem toda célula possui as mesmas organelas, e células de um organismo multicelular podem especializar-se. Entender essa diversidade evita tratar uma célula animal como modelo universal de toda a vida.',
    source: 'OpenStax Biology 2e — Biology 2e textbook',
    url: 'https://openstax.org/books/biology-2e/pages/index',
    tags: ['células', 'membrana', 'organelas', 'vida'],
  },
  {
    id: 'animal-diversity',
    title: 'A zoologia compara a diversidade e a história dos animais',
    field: 'Zoologia',
    period: 'Diversidade animal',
    summary:
      'Características corporais, desenvolvimento, comportamento e DNA ajudam a investigar relações entre grupos animais.',
    fact: 'A classificação biológica moderna usa múltiplas evidências, incluindo anatomia e dados moleculares, para propor relações evolutivas.',
    detail:
      'Uma semelhança pode refletir ancestralidade compartilhada ou evolução independente em condições parecidas. Por isso, pesquisadores não dependem de uma única característica visível: comparam fósseis, desenvolvimento, comportamento e sequências genéticas. Árvores filogenéticas são hipóteses testáveis sobre parentesco, não uma escada de progresso que coloca espécies atuais em níveis superiores ou inferiores. Toda espécie viva tem uma história evolutiva própria e adaptações ao seu contexto.',
    source: 'OpenStax Biology 2e — Biological Diversity',
    url: 'https://openstax.org/books/biology-2e/pages/index',
    tags: ['animais', 'biodiversidade', 'classificação', 'evolução'],
  },
  {
    id: 'insects-body-plan',
    title: 'Insetos compartilham um plano corporal com seis pernas',
    field: 'Entomologia',
    period: 'Artrópodes e diversidade',
    summary:
      'A anatomia dos insetos ajuda a distingui-los de outros artrópodes, como aranhas e crustáceos.',
    fact: 'O plano corporal típico dos insetos inclui cabeça, tórax e abdômen, com três pares de pernas ligados ao tórax.',
    detail:
      'A diversidade de insetos é enorme: há espécies com asas e sem asas, metamorfose completa ou incompleta e formas de alimentação muito distintas. A regra dos seis membros descreve o padrão corporal do grupo, embora pernas possam ser modificadas ou pouco evidentes em algumas fases. Aranhas não são insetos: pertencem a outro grupo de artrópodes e têm quatro pares de pernas. A identificação correta depende de observar várias características, não apenas o tamanho.',
    source: 'OpenStax Biology 2e — Arthropods',
    url: 'https://openstax.org/books/biology-2e/pages/28-6-superphylum-ecdysozoa-arthropods',
    tags: ['insetos', 'artrópodes', 'anatomia', 'biodiversidade'],
  },
  {
    id: 'marine-food-webs',
    title: 'A vida marinha depende de redes invisíveis de organismos',
    field: 'Biologia Marinha',
    period: 'Ecossistemas oceânicos',
    summary:
      'Plâncton, algas, animais e microrganismos formam redes alimentares em ambientes que mudam com luz, profundidade e correntes.',
    fact: 'O fitoplâncton é composto por microalgas e constitui a base de várias redes alimentares aquáticas.',
    detail:
      'Fitoplâncton inclui organismos microscópicos que vivem suspensos na água. Eles servem de alimento direto ou indireto a diversos animais e participam do ciclo global do carbono. A produtividade depende de luz e nutrientes, então pode ser alta em certas zonas costeiras e regiões de ressurgência e baixa em águas superficiais pobres em nutrientes. O oceano não é um ambiente uniforme: temperatura, pressão, salinidade e circulação criam habitats distintos.',
    source: 'NOAA Ocean Service — What Are Phytoplankton?',
    url: 'https://oceanservice.noaa.gov/facts/phyto.html',
    tags: ['oceano', 'plâncton', 'cadeia alimentar', 'ecossistemas'],
  },
  {
    id: 'evolution-populations',
    title: 'A evolução acontece em populações ao longo das gerações',
    field: 'Biologia Evolutiva',
    period: 'Seleção natural e variação',
    summary:
      'Variação herdável, reprodução desigual e tempo podem mudar características de uma população.',
    fact: 'Seleção natural atua sobre diferenças entre indivíduos, mas a evolução é descrita como mudança em populações entre gerações.',
    detail:
      'Indivíduos não evoluem geneticamente durante a vida em resposta consciente a uma necessidade. Se algumas variantes herdáveis influenciam sobrevivência ou reprodução em determinado ambiente, sua frequência pode mudar nas gerações seguintes. Mutação, deriva genética, fluxo gênico e seleção são processos diferentes que também afetam populações. Uma adaptação pode ser vantajosa num contexto e prejudicial em outro; evolução não tem objetivo nem direção garantida de progresso.',
    source: 'OpenStax Biology 2e — Evolutionary Processes',
    url: 'https://openstax.org/books/biology-2e/pages/preface',
    tags: ['evolução', 'populações', 'seleção natural', 'hereditariedade'],
  },
  {
    id: 'immune-response',
    title: 'O sistema imune combina defesas rápidas e respostas específicas',
    field: 'Imunologia',
    period: 'Imunidade inata e adaptativa',
    summary:
      'Barreiras, células e moléculas trabalham em camadas para reconhecer ameaças e limitar infecções.',
    fact: 'A imunidade inata responde rapidamente a padrões gerais; a imunidade adaptativa pode reconhecer alvos específicos e formar memória.',
    detail:
      'Pele e mucosas ajudam a impedir a entrada de agentes. Se eles atravessam essas barreiras, células e proteínas da imunidade inata atuam primeiro. Linfócitos B e T participam de respostas adaptativas com reconhecimento mais específico; algumas dessas respostas podem reagir mais rapidamente a uma exposição posterior. Os sistemas se comunicam e não são completamente independentes. Resposta imune também pode causar dano ou falhar, e uma descrição geral não substitui avaliação clínica.',
    source: 'OpenStax Biology 2e — Innate Immune Response',
    url: 'https://openstax.org/books/biology-2e/pages/42-1-innate-immune-response',
    tags: ['imunidade', 'células', 'anticorpos', 'infecção'],
  },
  {
    id: 'physiology-homeostasis',
    title: 'O corpo regula condições internas sem mantê-las perfeitamente fixas',
    field: 'Fisiologia',
    period: 'Regulação fisiológica',
    summary:
      'Sistemas fisiológicos monitoram variáveis e respondem a mudanças para manter faixas compatíveis com o funcionamento do organismo.',
    fact: 'A homeostase mantém condições internas dentro de intervalos regulados; valores reais podem oscilar em torno de referências.',
    detail:
      'Temperatura, glicose e equilíbrio de água são exemplos de variáveis reguladas. Em muitos sistemas, sensores detectam mudanças, centros de controle integram informação e efetores ajudam a produzir uma resposta. O feedback negativo tende a contrariar desvios; feedback positivo amplifica uma mudança em processos específicos, como parte do parto. Homeostase não significa imobilidade nem garante saúde em todas as circunstâncias: idade, ambiente e doença afetam os limites e as respostas.',
    source: 'OpenStax Anatomy and Physiology 2e — Homeostasis',
    url: 'https://openstax.org/books/anatomy-and-physiology-2e/pages/1-5-homeostasis',
    tags: ['corpo humano', 'regulação', 'feedback', 'saúde'],
  },
  {
    id: 'anatomy-structure-function',
    title: 'Anatomia investiga estruturas em diferentes escalas',
    field: 'Anatomia',
    period: 'Organização do corpo',
    summary:
      'Do tecido ao órgão, a forma e a posição das estruturas ajudam a entender como o corpo se organiza.',
    fact: 'A anatomia descreve estruturas corporais; a fisiologia investiga como elas funcionam, e as duas áreas se complementam.',
    detail:
      'A organização pode ser estudada em níveis: moléculas, células, tecidos, órgãos e sistemas. Por exemplo, o coração tem câmaras e válvulas cuja disposição contribui para o fluxo do sangue. A estrutura ajuda a formular hipóteses sobre função, mas não a determina isoladamente: é preciso observar e testar. A anatomia também inclui variações normais entre pessoas, então diagramas didáticos não representam todos os corpos da mesma maneira.',
    source: 'OpenStax Anatomy and Physiology 2e',
    url: 'https://openstax.org/books/anatomy-and-physiology-2e/pages/1-introduction',
    tags: ['corpo', 'órgãos', 'tecidos', 'estrutura'],
  },
  {
    id: 'epidemiology-patterns',
    title: 'Epidemiologia procura padrões de saúde em populações',
    field: 'Epidemiologia',
    period: 'Investigação em saúde pública',
    summary:
      'A área analisa quem é afetado, onde e quando, para orientar hipóteses e respostas coletivas.',
    fact: 'Uma associação observada entre exposição e doença não prova, sozinha, que uma causou a outra.',
    detail:
      'Investigações epidemiológicas descrevem a distribuição de eventos de saúde e testam fatores que podem influenciá-los. Comparar grupos, definir casos, estimar taxas e considerar vieses ajuda a distinguir sinais de coincidências. Estudos observacionais são essenciais, mas podem sofrer confusão e erro de medição; ensaios e outras evidências podem complementar a análise. Resultados populacionais orientam prevenção e políticas, porém não predizem com certeza o que ocorrerá com uma pessoa específica.',
    source: 'CDC — Conducting a Field Investigation',
    url: 'https://www.cdc.gov/field-epi-manual/php/chapters/field-investigation.html',
    tags: ['saúde pública', 'populações', 'risco', 'dados'],
  },
  {
    id: 'drug-development-evidence',
    title: 'Um medicamento passa por etapas antes e depois da aprovação',
    field: 'Farmacologia',
    period: 'Pesquisa e avaliação de medicamentos',
    summary:
      'Descoberta, estudos pré-clínicos, ensaios clínicos e monitoramento procuram avaliar benefícios e riscos.',
    fact: 'A aprovação regulatória depende de revisão de evidências para usos específicos, e a vigilância de segurança continua após a comercialização.',
    detail:
      'Moléculas promissoras são estudadas em laboratório e em modelos pré-clínicos antes de serem avaliadas em pessoas. Ensaios clínicos têm fases e objetivos diferentes, incluindo segurança e eficácia. Autoridades analisam dados apresentados, mas aprovação não significa risco zero nem benefício para qualquer condição ou paciente. Eventos adversos raros podem aparecer apenas quando muitas pessoas usam o produto; por isso, existe monitoramento pós-mercado. Este texto é educativo e não recomenda tratamentos.',
    source: 'U.S. FDA — The Drug Development Process',
    url: 'https://www.fda.gov/patients/learn-about-drug-and-device-approvals/drug-development-process',
    tags: ['medicamentos', 'ensaios clínicos', 'segurança', 'evidência'],
  },
  {
    id: 'cognitive-processes',
    title: 'Cognição reúne percepção, memória e resolução de problemas',
    field: 'Ciência Cognitiva',
    period: 'Estudo interdisciplinar da mente',
    summary:
      'Pesquisadores combinam métodos da psicologia, neurociência, linguística, filosofia e computação para estudar a mente.',
    fact: 'Cognição abrange processos como perceber, aprender, lembrar, usar linguagem, julgar e resolver problemas.',
    detail:
      'Uma tarefa cotidiana, como planejar um caminho, pode envolver atenção, memória, conhecimentos prévios e avaliação de alternativas. Nenhum processo isolado explica toda a experiência. A ciência cognitiva testa hipóteses com experimentos comportamentais, dados cerebrais, modelos computacionais e análise da linguagem. Esses métodos medem aspectos diferentes e têm limites; uma atividade cerebral associada a uma tarefa, por exemplo, não revela automaticamente o conteúdo de um pensamento.',
    source: 'OpenStax Psychology 2e — What Is Cognition?',
    url: 'https://openstax.org/books/psychology-2e/pages/7-1-what-is-cognition',
    tags: ['mente', 'percepção', 'memória', 'linguagem'],
  },
  {
    id: 'psychology-learning',
    title: 'Aprender não é o mesmo que nascer com um reflexo',
    field: 'Psicologia',
    period: 'Aprendizagem e comportamento',
    summary:
      'A psicologia estuda como experiências, contexto e processos mentais influenciam comportamento.',
    fact: 'Condicionamento clássico, condicionamento operante e aprendizagem observacional são formas distintas estudadas pela psicologia.',
    detail:
      'No condicionamento clássico, associações entre estímulos podem alterar respostas. No operante, consequências influenciam a probabilidade de um comportamento voltar a ocorrer. Na aprendizagem observacional, pessoas podem adquirir ações ao observar outras. Esses conceitos ajudam a organizar estudos, mas não descrevem toda aprendizagem nem significam que cada comportamento possa ser reduzido a uma única causa. Pesquisas psicológicas precisam considerar desenho, amostra, contexto cultural e possibilidade de replicação.',
    source: 'OpenStax Psychology 2e — What Is Learning?',
    url: 'https://openstax.org/books/psychology-2e/pages/6-1-what-is-learning',
    tags: ['aprendizagem', 'comportamento', 'experiência', 'psicologia'],
  },
  {
    id: 'ai-risk-context',
    title: 'Avaliar uma IA envolve mais que medir sua precisão',
    field: 'Inteligência Artificial',
    period: 'Sistemas de IA e sociedade',
    summary:
      'Um sistema pode ter bom desempenho em um teste e ainda falhar quando muda o contexto, os dados ou o modo de uso.',
    fact: 'O framework do NIST organiza práticas para identificar, avaliar e gerenciar riscos de sistemas de inteligência artificial.',
    detail:
      'Avaliar IA envolve definir a finalidade, quem pode ser afetado, quais dados entram e o que acontece quando há erro. Métricas técnicas são necessárias, mas dependem do conjunto de teste e podem ocultar diferenças entre grupos ou condições de uso. Monitoramento, documentação, supervisão humana e possibilidade de contestação são partes do ciclo de vida. Um framework de gestão de risco não certifica que um sistema é justo ou seguro; ele estrutura perguntas e controles a serem examinados.',
    source: 'NIST — AI Risk Management Framework',
    url: 'https://www.nist.gov/itl/ai-risk-management-framework',
    tags: ['inteligência artificial', 'risco', 'avaliação', 'responsabilidade'],
  },
  {
    id: 'robotics-autonomy',
    title: 'Robôs espaciais precisam agir com comunicação limitada',
    field: 'Robótica',
    period: 'Exploração espacial',
    summary:
      'Robôs combinam sensores, atuadores e controle para operar em ambientes onde intervenção humana imediata é difícil.',
    fact: 'Rovers e helicópteros em Marte executam sequências planejadas localmente porque sinais de rádio levam tempo para viajar entre a Terra e o planeta.',
    detail:
      'Um robô espacial precisa perceber parte do ambiente, tomar decisões dentro de limites e enviar dados para equipes na Terra. Autonomia reduz a necessidade de comandos contínuos, mas não equivale a inteligência geral: o sistema opera segundo objetivos, sensores e regras projetados. Poeira, terreno e falhas podem exigir atualizações de software e novos planos. As equipes usam testes, simulações e telemetria para reduzir riscos, mas a distância torna certas incertezas inevitáveis.',
    source: 'NASA — Robotics',
    url: 'https://www.nasa.gov/robotics/',
    tags: ['robôs', 'autonomia', 'Marte', 'sensores'],
  },
  {
    id: 'statistics-samples',
    title: 'Estatística transforma dados em conclusões com limites explícitos',
    field: 'Estatística',
    period: 'Amostragem e inferência',
    summary:
      'Amostras permitem estudar populações maiores, desde que a seleção e a incerteza sejam consideradas.',
    fact: 'Uma amostra mal selecionada pode produzir estimativas enviesadas mesmo quando contém muitas observações.',
    detail:
      'Estatística descritiva resume os dados observados; inferência usa modelos e probabilidade para estimar o que pode valer além da amostra. Tamanho é apenas uma característica: representatividade, não resposta, forma de medição e análise também afetam resultados. Intervalos de confiança expressam propriedades de um procedimento sob hipóteses específicas, não a probabilidade pessoal de um parâmetro estar no intervalo já calculado. Toda conclusão deve dizer de que dados e pressupostos depende.',
    source: 'OpenStax Introductory Statistics 2e — Definitions and Key Terms',
    url: 'https://openstax.org/books/introductory-statistics-2e/pages/1-1-definitions-of-statistics-probability-and-key-terms',
    tags: ['dados', 'amostras', 'probabilidade', 'inferência'],
  },
  {
    id: 'logic-validity',
    title: 'Um argumento válido pode partir de premissas falsas',
    field: 'Lógica',
    period: 'Validade e argumentos',
    summary:
      'A lógica formal avalia se a conclusão decorre da forma das premissas, separando validade de verdade factual.',
    fact: 'Um argumento é válido quando não há situação em que todas as premissas sejam verdadeiras e a conclusão falsa.',
    detail:
      'Considere a forma: se A, então B; A; portanto B. A inferência é válida por sua estrutura, independentemente de os enunciados concretos serem verdadeiros. Um argumento sólido precisa, além de validade, de premissas verdadeiras. Essa distinção ajuda a detectar raciocínios persuasivos que ainda não provam sua conclusão. Existem diferentes sistemas lógicos e diferentes noções de validade; o contexto e a linguagem usada precisam ser explicitados.',
    source: 'Stanford Encyclopedia of Philosophy — Free Logic',
    url: 'https://plato.stanford.edu/entries/logic-free/',
    tags: ['argumentos', 'validade', 'premissas', 'raciocínio'],
  },
  {
    id: 'number-theory-primes',
    title: 'A prova de Euclides mostra que os números primos não acabam',
    field: 'Teoria dos Números',
    period: 'Demonstrações clássicas',
    summary:
      'Um raciocínio por contradição mostra que qualquer lista finita de primos deixa algum de fora.',
    fact: 'O produto de uma lista finita de primos mais um não é divisível por nenhum primo daquela lista.',
    detail:
      'Suponha que uma lista contenha todos os primos. Multiplique seus elementos e some um. O resultado deixa resto um quando dividido por qualquer primo listado. Ele pode ser primo ou composto, mas todo inteiro maior que um tem fatores primos; nenhum desses fatores pode ser da lista. Logo, a lista não era completa. A construção não afirma que o produto mais um seja sempre primo: ela demonstra apenas que existem infinitos primos.',
    source: 'Harvey Mudd College — How Many Primes?',
    url: 'https://math.hmc.edu/funfacts/how-many-primes/',
    tags: ['primos', 'Euclides', 'prova', 'divisibilidade'],
  },
  {
    id: 'topology-continuity',
    title: 'Topologia estuda propriedades que resistem a deformações contínuas',
    field: 'Topologia',
    period: 'Geometria e espaços',
    summary:
      'A área abstrai ideias de continuidade, vizinhança e conexão para comparar espaços de formas diferentes.',
    fact: 'Em topologia, uma caneca com uma alça e um toro são equivalentes em um sentido matemático idealizado porque cada um tem um furo.',
    detail:
      'A famosa comparação não diz que objetos físicos podem ser moldados sem rasgar ou colar na vida real. Ela imagina deformações contínuas que preservam características topológicas como conexão e número de furos. A topologia fornece ferramentas para análise, geometria, física e ciência de dados. Definições formais especificam quais conjuntos de pontos e vizinhanças formam um espaço; sem essas condições, metáforas visuais podem induzir erros.',
    source: 'MIT OpenCourseWare — Introduction to Topology',
    url: 'https://ocw.mit.edu/courses/18-901-introduction-to-topology-fall-2004/',
    tags: ['espaços', 'continuidade', 'geometria', 'deformação'],
  },
  {
    id: 'applied-models',
    title: 'Modelos matemáticos simplificam para responder perguntas concretas',
    field: 'Matemática Aplicada',
    period: 'Modelagem matemática',
    summary:
      'Equações e simulações ajudam a representar processos reais, testar cenários e estimar consequências.',
    fact: 'Um modelo matemático depende de hipóteses e dados; resultados são válidos dentro dos limites em que essas escolhas fazem sentido.',
    detail:
      'Para descrever uma população, uma ponte ou a propagação de calor, o modelador seleciona variáveis relevantes e deixa outras de fora. Isso permite calcular, mas também cria limitações. Comparar previsões com observações ajuda a avaliar o modelo, e análise de sensibilidade mostra quais parâmetros mais influenciam o resultado. Um modelo que se ajusta aos dados passados não necessariamente prevê bem situações novas; extrapolações precisam ser tratadas com cautela.',
    source: 'OpenStax Calculus Volume 1',
    url: 'https://openstax.org/books/calculus-volume-1/pages/1-introduction',
    tags: ['modelos', 'equações', 'simulação', 'dados'],
  },
  {
    id: 'meteorology-air-masses',
    title: 'Frentes e massas de ar ajudam a organizar a previsão do tempo',
    field: 'Meteorologia',
    period: 'Sistemas meteorológicos',
    summary:
      'Diferenças de temperatura, umidade e pressão movimentam o ar e podem produzir mudanças no tempo local.',
    fact: 'Uma frente marca uma zona de transição entre massas de ar com características diferentes.',
    detail:
      'Quando uma massa de ar frio avança sobre ar mais quente, pode forçá-lo a subir e favorecer nuvens e precipitação. O resultado depende de umidade, estabilidade, relevo e velocidade do sistema. Uma frente não determina sozinha que haverá tempestade em cada ponto. Meteorologistas combinam observações de estações, radares, satélites e modelos numéricos; previsões ficam menos precisas em escalas temporais e espaciais mais detalhadas.',
    source: 'NOAA Education — Weather Systems and Patterns',
    url: 'https://www.noaa.gov/education/resource-collections/weather-atmosphere/weather-systems-patterns',
    tags: ['tempo', 'frentes', 'massas de ar', 'previsão'],
  },
  {
    id: 'atmosphere-layers',
    title: 'O tempo local depende de padrões globais e condições regionais',
    field: 'Ciência Atmosférica',
    period: 'Interações entre atmosfera, oceano e superfície',
    summary:
      'A previsão atmosférica combina circulação em grande escala com condições específicas de cada região.',
    fact: 'A NOAA descreve o tempo local como resultado da interação entre padrões atmosféricos, energia solar, oceanos e paisagens.',
    detail:
      'Correntes de jato podem conduzir sistemas meteorológicos, enquanto frentes marcam zonas de transição entre massas de ar. Latitude, relevo e umidade ajudam a definir como esses padrões afetam cada região. Um evento local, portanto, não depende de uma única variável; cientistas combinam satélites, estações, radares e modelos para acompanhar a evolução. O mesmo sistema amplo pode trazer impactos diferentes em lugares distintos, e uma previsão probabilística não garante que um fenômeno ocorrerá em cada ponto.',
    source: 'NOAA Education — Weather Systems and Patterns',
    url: 'https://www.noaa.gov/education/resource-collections/weather-atmosphere/weather-systems-patterns',
    tags: ['atmosfera', 'tempo', 'oceano', 'clima'],
  },
  {
    id: 'glacier-flow',
    title: 'Geleiras crescem com neve acumulada e fluem sob o próprio peso',
    field: 'Glaciologia',
    period: 'Criossfera',
    summary:
      'Uma geleira é uma massa persistente de gelo terrestre que se deforma e se move ao longo do tempo.',
    fact: 'Geleiras se formam quando neve se acumula, compacta em gelo e começa a fluir; seu balanço depende de ganho e perda de massa.',
    detail:
      'A neve acumulada transforma-se em firn e, depois, em gelo glacial. O peso causa deformação interna e, em algumas condições, deslizamento sobre o leito. Uma geleira pode avançar, permanecer estável ou recuar conforme a relação entre acumulação e ablação; recuo não significa que o gelo esteja fluindo para trás, mas que a perda supera a reposição. Estudos combinam imagens, medições de campo e modelos para acompanhar mudanças regionais.',
    source: 'National Snow and Ice Data Center — Science of Glaciers',
    url: 'https://nsidc.org/learn/parts-cryosphere/glaciers/science-glaciers',
    tags: ['gelo', 'neve', 'criossfera', 'clima'],
  },
  {
    id: 'volcano-eruption-style',
    title: 'A viscosidade do magma influencia o estilo de uma erupção',
    field: 'Vulcanologia',
    period: 'Processos vulcânicos',
    summary:
      'Gases e composição do magma ajudam a explicar por que algumas erupções fluem e outras são explosivas.',
    fact: 'Magma mais viscoso pode reter gases e permitir acúmulo de pressão; magma mais fluido tende a deixar gases escapar com maior facilidade.',
    detail:
      'Magma é rocha fundida abaixo da superfície; quando chega ao exterior, recebe o nome de lava. A quantidade de sílica, temperatura e cristais influenciam a viscosidade. Água e outros gases dissolvidos também são importantes. Esses fatores não permitem prever sozinhos o momento ou tamanho de uma erupção: monitoramento sísmico, deformação do solo, gases e história do vulcão entram na avaliação de perigo. Vulcões diferem muito e podem mudar de comportamento.',
    source: 'USGS — How Do Volcanoes Erupt?',
    url: 'https://www.usgs.gov/faqs/how-do-volcanoes-erupt',
    tags: ['vulcões', 'magma', 'lava', 'gases'],
  },
  {
    id: 'seismic-waves',
    title: 'Ondas sísmicas revelam o interior da Terra',
    field: 'Sismologia',
    period: 'Registro e análise de terremotos',
    summary:
      'Sismógrafos registram vibrações que se propagam pelo solo e ajudam a localizar terremotos e estudar estruturas profundas.',
    fact: 'Ondas P atravessam sólidos e líquidos, enquanto ondas S não se propagam através de líquidos.',
    detail:
      'As ondas P são compressivas; as S fazem o material oscilar transversalmente. Sua velocidade e trajetória mudam conforme densidade, rigidez e estado dos materiais. A ausência de certas ondas em algumas regiões ajudou a inferir que o núcleo externo terrestre é líquido. Localizar um terremoto requer comparar tempos de chegada em várias estações. Um sismograma registra movimento, mas sua interpretação depende de instrumentos, modelos e incertezas.',
    source: 'USGS — The Science of Earthquakes',
    url: 'https://www.usgs.gov/programs/earthquake-hazards/science-earthquakes',
    tags: ['terremotos', 'ondas P', 'ondas S', 'Terra'],
  },
  {
    id: 'mineral-definition',
    title: 'Minerais têm estrutura e composição características',
    field: 'Mineralogia',
    period: 'Cristais e minerais',
    summary: 'A mineralogia estuda a composição, estrutura, propriedades e formação de minerais.',
    fact: 'O USGS define mineral como material natural, inorgânico, com composição química e estrutura interna ordenada características.',
    detail:
      'Cristais se formam quando átomos ou íons se organizam em padrões repetidos. Um mesmo mineral pode apresentar variações dentro de limites químicos, e minerais diferentes podem compartilhar alguns elementos. Rochas, por sua vez, são agregados de um ou mais minerais ou de matéria mineral não diferenciada. Cor é uma pista útil, mas impurezas podem alterá-la; dureza, clivagem, brilho e densidade ajudam na identificação.',
    source: 'USGS — Difference Between a Rock and a Mineral',
    url: 'https://www.usgs.gov/faqs/what-difference-between-a-rock-and-a-mineral',
    tags: ['minerais', 'cristais', 'rochas', 'geologia'],
  },
  {
    id: 'soil-horizons',
    title: 'Um perfil de solo registra processos de formação',
    field: 'Ciência do Solo',
    period: 'Horizontes do solo',
    summary:
      'Camadas do solo se desenvolvem a partir do material de origem sob influência do clima, organismos, relevo e tempo.',
    fact: 'Horizontes do solo variam entre locais; um perfil pode não apresentar todas as camadas típicas.',
    detail:
      'A água transporta partículas e substâncias para baixo, raízes e organismos incorporam matéria orgânica e minerais se alteram ao longo do tempo. A combinação desses processos produz horizontes com propriedades distintas. Um horizonte superficial costuma concentrar raízes e matéria orgânica, mas espessura e composição variam com o ambiente e o uso da terra. Agricultura intensiva e erosão podem modificar ou remover camadas. Por isso, uma descrição local não deve ser generalizada para todos os solos.',
    source: 'USDA Natural Resources Conservation Service — Soil Horizons',
    url: 'https://www.nrcs.usda.gov/sites/default/files/2022-11/from-the-surface-down.pdf',
    tags: ['solo', 'horizontes', 'raízes', 'erosão'],
  },
  {
    id: 'biodiversity-conservation',
    title: 'Conservação depende de habitats e relações ecológicas',
    field: 'Conservação Ambiental',
    period: 'Biodiversidade e ecossistemas',
    summary:
      'Proteger espécies envolve também ambientes, processos ecológicos e pressões humanas que variam por região.',
    fact: 'A biodiversidade inclui diversidade dentro das espécies, entre espécies e de ecossistemas.',
    detail:
      'Perda e fragmentação de habitat, exploração, espécies invasoras, poluição e mudanças climáticas podem interagir e afetar populações. Medidas de conservação incluem áreas protegidas, restauração, manejo sustentável e acordos entre países. Uma estratégia precisa considerar comunidades locais, usos da terra e evidências sobre espécies e ecossistemas. A criação de uma área protegida não garante, por si só, que ameaças tenham sido removidas nem que todas as espécies respondam da mesma forma.',
    source: 'Convention on Biological Diversity — Convention',
    url: 'https://www.cbd.int/convention/',
    tags: ['biodiversidade', 'habitats', 'espécies', 'conservação'],
  },
  {
    id: 'food-safety-science',
    title: 'Segurança dos alimentos controla perigos ao longo da cadeia',
    field: 'Ciência dos Alimentos',
    period: 'Microbiologia e saúde pública',
    summary:
      'Produção, armazenamento, preparo e transporte podem influenciar riscos microbiológicos e químicos.',
    fact: 'Contaminação cruzada, tempo e temperatura inadequados estão entre fatores que podem aumentar doenças transmitidas por alimentos.',
    detail:
      'Bactérias, vírus, parasitas e substâncias químicas podem contaminar alimentos em etapas diferentes. Boas práticas incluem higiene, separação de alimentos crus e prontos, cozimento adequado e conservação em temperaturas seguras. Nem todo alimento contaminado muda de cheiro ou aparência, então a avaliação sensorial não substitui controle sanitário. Recomendações concretas variam conforme alimento, processo e regras locais; este conteúdo explica princípios gerais, não substitui orientação de autoridades de saúde.',
    source: 'World Health Organization — Food Safety',
    url: 'https://www.who.int/news-room/fact-sheets/detail/food-safety',
    tags: ['alimentos', 'microbiologia', 'higiene', 'saúde pública'],
  },
  {
    id: 'engineering-systems',
    title: 'Engenharia transforma necessidades em sistemas testáveis',
    field: 'Engenharia',
    period: 'Projeto e validação',
    summary:
      'Projetar uma solução envolve requisitos, restrições, escolhas técnicas, testes e revisões ao longo do ciclo de vida.',
    fact: 'Um projeto de engenharia precisa verificar se o sistema atende requisitos definidos em condições de uso previstas.',
    detail:
      'Engenheiros transformam uma necessidade em requisitos mensuráveis, com limites de custo, segurança, desempenho e manutenção. Alternativas são avaliadas e protótipos testados; resultados podem levar a mudanças no projeto. Em sistemas complexos, equipes documentam interfaces e dependências para evitar que uma alteração local cause falhas em outro componente. Um teste bem-sucedido não garante desempenho em qualquer ambiente: cenários, critérios e limitações precisam ser descritos.',
    source: 'NASA — Systems Engineering',
    url: 'https://www.nasa.gov/reference/systems-engineering-handbook/',
    tags: ['projeto', 'requisitos', 'testes', 'sistemas'],
  },
  {
    id: 'map-projections',
    title: 'Todo mapa plano distorce algum aspecto da Terra',
    field: 'Cartografia',
    period: 'Projeções cartográficas',
    summary:
      'Transformar uma superfície aproximadamente esférica em uma folha exige escolhas sobre o que preservar.',
    fact: 'Projeções cartográficas podem preservar propriedades como área, ângulo ou distância em certas condições, mas não todas simultaneamente em um mapa plano.',
    detail:
      'A projeção de Mercator preserva ângulos localmente e foi útil para navegação, mas amplia áreas perto dos polos. Projeções equivalentes preservam áreas relativas, embora alterem formas. A escolha depende da finalidade, da região e da escala. Assim, um mapa não é uma cópia neutra do planeta: é uma representação construída com decisões matemáticas e convenções. Leia legenda, escala, orientação e projeção antes de comparar tamanhos ou distâncias.',
    source: 'USGS — How Are Different Map Projections Used?',
    url: 'https://www.usgs.gov/faqs/how-are-different-map-projections-used',
    tags: ['mapas', 'projeções', 'escala', 'representação'],
  },
  {
    id: 'sociology-patterns',
    title: 'A sociologia relaciona experiências individuais a padrões coletivos',
    field: 'Sociologia',
    period: 'Sociedade e interação',
    summary: 'A área investiga como grupos, instituições, cultura e relações moldam a vida social.',
    fact: 'Pesquisas sociológicas estudam interações em pequena escala e padrões que aparecem em sociedades inteiras.',
    detail:
      'Uma entrevista pode revelar experiências de pessoas; censos e séries históricas ajudam a observar tendências populacionais. Teorias sociológicas orientam perguntas e interpretações, mas não substituem a evidência coletada. Comparar grupos exige atenção a amostragem, definições e contexto cultural. Uma associação entre posição social e resultado não explica automaticamente o mecanismo causal, que pode envolver instituições, recursos, políticas e história.',
    source: 'OpenStax Introduction to Sociology 3e — What Is Sociology?',
    url: 'https://openstax.org/books/introduction-sociology-3e/pages/1-1-what-is-sociology',
    tags: ['sociedade', 'grupos', 'cultura', 'instituições'],
  },
  {
    id: 'political-institutions',
    title: 'Ciência política compara poder, instituições e participação',
    field: 'Ciência Política',
    period: 'Instituições e governo',
    summary:
      'A área estuda como decisões coletivas são tomadas, disputadas e aplicadas em diferentes contextos.',
    fact: 'Constituições e instituições distribuem autoridade e estabelecem procedimentos, mas seu funcionamento depende também de práticas e disputas políticas.',
    detail:
      'Pesquisadores comparam sistemas eleitorais, legislativos, tribunais, partidos e movimentos sociais. Regras formais indicam quem pode decidir e como, enquanto dados e história ajudam a entender como essas regras operam na prática. Um caso isolado não representa todos os países, e correlação entre instituições e resultados pode ter explicações concorrentes. Comparações cuidadosas definem conceitos, casos e período antes de tirar conclusões.',
    source: 'OpenStax American Government 3e',
    url: 'https://openstax.org/books/american-government-3e/pages/1-introduction',
    tags: ['poder', 'instituições', 'governo', 'participação'],
  },
  {
    id: 'digital-archaeology-records',
    title: 'Ferramentas digitais ajudam a documentar sítios arqueológicos',
    field: 'Arqueologia Digital',
    period: 'Métodos de documentação e arquivo',
    summary:
      'Fotogrametria, sistemas de informação geográfica e arquivos digitais apoiam registro, análise e compartilhamento de dados arqueológicos.',
    fact: 'Modelos digitais e bases de dados preservam documentação e permitem novas análises, mas não substituem o contexto físico do sítio.',
    detail:
      'Imagens sobrepostas podem gerar modelos tridimensionais; coordenadas e camadas geográficas ajudam a analisar relações espaciais entre achados. Metadados registram quem coletou os dados, quando e com quais métodos. A digitalização não elimina erros de medição, lacunas de amostragem ou decisões de interpretação, e a destruição de um contexto escavado não pode ser desfeita pelo modelo. Repositórios com documentação e acesso duradouro apoiam revisão e reutilização responsável.',
    source: 'Archaeology Data Service — Digital Repository',
    url: 'https://archaeologydataservice.ac.uk/',
    tags: ['arqueologia', 'dados digitais', '3D', 'documentação'],
  },
];

export const coverageTopics: Topic[] = seeds.map(seed => ({
  ...seed,
  readingTime: 5,
  confidence: 87,
  confidenceLabel: 'Fonte pública de referência · revisão editorial pendente',
  sourceCount: seed.url2 ? 2 : 1,
  sources: [
    {
      name: seed.source,
      url: seed.url,
      kind: seed.sourceKind ?? 'Instituição científica ou livro didático aberto',
    },
    ...(seed.source2 && seed.url2
      ? [{ name: seed.source2, url: seed.url2, kind: 'Fonte pública complementar' }]
      : []),
  ],
}));
