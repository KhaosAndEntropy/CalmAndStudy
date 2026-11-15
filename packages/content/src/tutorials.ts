import type { Tutorial } from './types';

export const tutorials: Tutorial[] = [
  {
    id: 'timeline',
    title: 'Monte uma linha do tempo com fontes',
    field: 'História · método',
    durationMinutes: 7,
    description:
      'Organize acontecimentos sem perder as datas aproximadas, as lacunas e o contexto de cada fonte.',
    materials: [
      '3 acontecimentos de um período que desperte seu interesse',
      'Uma fonte para cada acontecimento',
    ],
    steps: [
      {
        title: 'Escolha um recorte',
        instruction:
          'Defina uma pergunta pequena, como “o que mudou nesta cidade entre duas épocas?”. Um recorte claro ajuda a comparar fatos relacionados.',
      },
      {
        title: 'Registre cada evidência',
        instruction:
          'Para cada acontecimento, anote data ou intervalo, lugar, fonte e o que a fonte realmente afirma. Marque datas incertas como aproximadas.',
      },
      {
        title: 'Ordene no tempo',
        instruction:
          'Coloque os acontecimentos do mais antigo ao mais recente. Se duas datas forem incertas ou sobrepostas, represente isso sem forçar uma ordem exata.',
      },
      {
        title: 'Ligue sem presumir causa',
        instruction:
          'Adicione uma conexão entre eventos apenas quando as fontes sustentarem uma relação. “Aconteceu depois” não significa automaticamente “foi causado por”.',
      },
    ],
    wrapUp:
      'Sua linha do tempo mostra a sequência e também deixa visível o que ainda precisa de fonte ou contexto.',
  },
  {
    id: 'source-check',
    title: 'Confira uma afirmação científica',
    field: 'Ciência · método',
    durationMinutes: 6,
    description:
      'Pratique separar uma afirmação, a evidência que a sustenta e o que ainda não sabemos.',
    materials: [
      'Uma afirmação científica específica',
      'Acesso a uma fonte institucional ou artigo',
    ],
    steps: [
      {
        title: 'Escreva a afirmação com precisão',
        instruction:
          'Troque frases vagas por algo que possa ser conferido: quem, o quê, em que condições e em qual período?',
      },
      {
        title: 'Encontre a evidência direta',
        instruction:
          'Abra a fonte original ou institucional e procure a seção, tabela ou observação que sustenta a afirmação. O título de uma matéria sozinho não basta.',
      },
      {
        title: 'Confira uma fonte independente',
        instruction:
          'Procure outra fonte confiável que não esteja apenas repetindo a primeira. Veja se concorda, usa o mesmo dado ou aponta uma limitação.',
      },
      {
        title: 'Registre o grau de certeza',
        instruction:
          'Anote o que é bem estabelecido, o que é interpretação e qual ressalva importa. Se a evidência não bastar, deixe a pergunta em aberto.',
      },
    ],
    wrapUp:
      'Uma boa verificação termina com links e ressalvas claros, não apenas com uma nota de confiança.',
  },
  {
    id: 'venus-comparison',
    title: 'Compare o dia e o ano de Vênus',
    field: 'Astronomia · prática',
    durationMinutes: 5,
    description:
      'Use dados publicados pela NASA para calcular a diferença e perceber como a definição de “dia” muda a comparação.',
    materials: ['Papel ou calculadora', 'NASA — Venus Facts'],
    steps: [
      {
        title: 'Copie os dois valores',
        instruction:
          'A página da NASA informa uma rotação de Vênus de cerca de 243 dias terrestres e uma órbita ao redor do Sol de cerca de 225 dias terrestres.',
      },
      {
        title: 'Calcule a diferença',
        instruction:
          'Subtraia 225 de 243. A rotação sideral de Vênus leva cerca de 18 dias terrestres a mais do que seu ano.',
      },
      {
        title: 'Compare em proporção',
        instruction:
          'Divida 243 por 225: o resultado é aproximadamente 1,08. A rotação sideral dura cerca de 8% mais do que uma órbita.',
      },
      {
        title: 'Inclua a ressalva',
        instruction:
          'A NASA também distingue o dia solar, do nascer ao pôr do Sol, que dura cerca de 117 dias terrestres. Diga qual definição de dia você está usando.',
      },
    ],
    wrapUp:
      'O cálculo fica mais claro quando a unidade e a definição de “dia” acompanham o número.',
    sources: [{ name: 'NASA — Venus Facts', url: 'https://science.nasa.gov/venus/venus-facts/' }],
  },
  {
    id: 'choose-a-map',
    title: 'Escolha um mapa para uma pergunta',
    field: 'Geografia · prática',
    durationMinutes: 6,
    description:
      'Compare projeções e perceba que cada mapa preserva algumas propriedades e distorce outras.',
    materials: ['Papel ou bloco de notas', 'Dois mapas-múndi com projeções diferentes'],
    steps: [
      {
        title: 'Defina a pergunta',
        instruction:
          'Decida se quer comparar áreas, acompanhar uma rota ou observar formas. A finalidade ajuda a escolher o mapa.',
      },
      {
        title: 'Compare a representação',
        instruction:
          'Observe como regiões próximas aos polos aparecem em cada mapa. Anote o que parece maior, menor ou mais alongado.',
      },
      {
        title: 'Procure a projeção',
        instruction:
          'Confira o nome da projeção e a legenda. Não compare tamanhos sem saber que propriedade o mapa preserva.',
      },
      {
        title: 'Explique a escolha',
        instruction:
          'Escreva qual mapa ajuda melhor a responder sua pergunta e qual distorção ainda precisa ser considerada.',
      },
    ],
    wrapUp:
      'Um mapa é uma representação feita para uma finalidade; sua projeção faz parte da informação.',
    sources: [
      {
        name: 'USGS — How Are Different Map Projections Used?',
        url: 'https://www.usgs.gov/faqs/how-are-different-map-projections-used',
      },
    ],
  },
  {
    id: 'follow-a-drop',
    title: 'Acompanhe o caminho de uma gota',
    field: 'Hidrologia · prática',
    durationMinutes: 7,
    description:
      'Monte um percurso possível entre a superfície, o solo, a água subterrânea e um rio, sem transformar o ciclo em uma sequência única.',
    materials: ['Papel e lápis', 'Artigos sobre ciclo da água e aquíferos'],
    steps: [
      {
        title: 'Comece em um reservatório',
        instruction:
          'Escolha oceano, lago ou solo úmido e indique como a água pode passar para outro lugar.',
      },
      {
        title: 'Desenhe caminhos alternativos',
        instruction:
          'Inclua evaporação, condensação e precipitação. Acrescente infiltração e escoamento como caminhos possíveis, não etapas obrigatórias para toda gota.',
      },
      {
        title: 'Inclua o subsolo',
        instruction:
          'Mostre como parte da água infiltrada pode chegar à zona saturada e ficar armazenada em poros ou fraturas.',
      },
      {
        title: 'Revise suas setas',
        instruction:
          'Marque onde o clima, o solo e a geologia podem mudar o percurso. Evite desenhar um ciclo idêntico em todas as regiões.',
      },
    ],
    wrapUp:
      'O ciclo hidrológico é uma rede de caminhos e reservatórios; cada gota percorre apenas alguns deles.',
    sources: [
      {
        name: 'USGS — Condensation and the Water Cycle',
        url: 'https://www.usgs.gov/water-science-school/science/condensation-and-water-cycle',
      },
      {
        name: 'USGS — Aquifers and Groundwater',
        url: 'https://www.usgs.gov/water-science-school/science/aquifers-and-groundwater',
      },
    ],
  },
  {
    id: 'draw-a-food-web',
    title: 'Desenhe uma teia alimentar',
    field: 'Ecologia · prática',
    durationMinutes: 7,
    description:
      'Use setas para representar relações alimentares e diferencie o fluxo de energia da circulação da matéria.',
    materials: ['Papel e lápis', 'Um ecossistema conhecido, como jardim, lago ou floresta'],
    steps: [
      {
        title: 'Escolha os organismos',
        instruction:
          'Liste produtores, consumidores e decompositores que poderiam viver no ecossistema escolhido. Se não souber um organismo, marque como exemplo a pesquisar.',
      },
      {
        title: 'Ligue as relações',
        instruction:
          'Desenhe a seta daquilo que é consumido para quem obtém energia ao consumi-lo. A legenda evita inverter o sentido.',
      },
      {
        title: 'Transforme cadeia em rede',
        instruction:
          'Dê a pelo menos um consumidor mais de uma fonte de alimento e conecte vários caminhos.',
      },
      {
        title: 'Revise energia e matéria',
        instruction:
          'Indique que parte da energia se dissipa como calor e que nutrientes podem voltar ao ambiente por decomposição.',
      },
    ],
    wrapUp:
      'A teia é um modelo simplificado: ela mostra relações, mas não representa todos os organismos ou variações sazonais.',
    sources: [
      {
        name: 'OpenStax Biology 2e — Ecology of Ecosystems',
        url: 'https://openstax.org/books/biology-2e/pages/46-1-ecology-of-ecosystems',
      },
    ],
  },
  {
    id: 'build-a-human-timeline',
    title: 'Monte uma cronologia sem apagar as lacunas',
    field: 'Arqueologia · prática',
    durationMinutes: 8,
    description:
      'Organize evidências humanas em uma linha do tempo e confira se a sequência não transforma coincidência em causa.',
    materials: [
      'Papel ou aplicativo de notas',
      'Artigos sobre ferramentas de pedra, Homo sapiens e agricultura',
    ],
    steps: [
      {
        title: 'Anote datas e escalas',
        instruction:
          'Registre intervalos aproximados para ferramentas de pedra, surgimento de Homo sapiens e processos de agricultura.',
      },
      {
        title: 'Ordene sem comprimir',
        instruction:
          'Use uma linha do tempo proporcional ou marque claramente quando a escala não couber na folha. Não aproxime acontecimentos separados por centenas de milhares de anos.',
      },
      {
        title: 'Associe cada afirmação a uma evidência',
        instruction:
          'Registre se a informação vem de fóssil, artefato, genética ou outro tipo de dado.',
      },
      {
        title: 'Escreva uma ressalva',
        instruction:
          'Explique por que ferramentas muito antigas não podem ser atribuídas automaticamente a Homo sapiens.',
      },
    ],
    wrapUp:
      'Uma cronologia cuidadosa mostra o que sabemos, a distância entre acontecimentos e o que permanece incerto.',
    sources: [
      {
        name: 'Smithsonian Human Origins — Stone Tools',
        url: 'https://humanorigins.si.edu/evidence/behavior/stone-tools',
      },
      {
        name: 'Smithsonian Human Origins — Homo sapiens',
        url: 'https://humanorigins.si.edu/evidence/human-fossils/species/homo-sapiens',
      },
    ],
  },
  {
    id: 'weather-or-climate',
    title: 'Separe tempo meteorológico de clima',
    field: 'Meteorologia · prática',
    durationMinutes: 6,
    description:
      'Classifique afirmações pela escala de tempo e identifique quais dados seriam úteis para cada pergunta.',
    materials: ['Papel ou bloco de notas', 'Cinco observações ou manchetes sobre tempo e clima'],
    steps: [
      {
        title: 'Escolha as afirmações',
        instruction:
          'Anote cinco frases, como “choveu hoje” ou “a média de temperatura mudou ao longo de décadas”.',
      },
      {
        title: 'Marque a escala',
        instruction:
          'Classifique cada frase como observação do tempo em curto prazo ou análise de padrões climáticos em períodos mais longos.',
      },
      {
        title: 'Liste as variáveis',
        instruction:
          'Indique quais dados ajudariam: temperatura, precipitação, vento, umidade, período e local.',
      },
      {
        title: 'Procure o limite',
        instruction:
          'Explique por que um dia frio, sozinho, não confirma nem refuta uma tendência de clima.',
      },
    ],
    wrapUp:
      'A distinção depende de escala e contexto; uma observação local não substitui uma série de dados.',
    sources: [
      {
        name: 'NOAA — Weather Systems and Patterns',
        url: 'https://www.noaa.gov/education/resource-collections/weather-atmosphere/weather-systems-patterns',
      },
    ],
  },
  {
    id: 'inspect-a-sample',
    title: 'Descubra o que uma amostra permite dizer',
    field: 'Estatística · prática',
    durationMinutes: 7,
    description:
      'Planeje uma pequena coleta de dados e identifique limites antes de generalizar resultados.',
    materials: [
      'Papel ou planilha',
      'Uma pergunta simples, como o tempo de deslocamento de colegas',
    ],
    steps: [
      {
        title: 'Defina a população',
        instruction: 'Escreva sobre quem ou o que sua pergunta trata, incluindo local e período.',
      },
      {
        title: 'Escolha como observar',
        instruction:
          'Descreva como selecionaria participantes ou medições. Registre quem pode ficar de fora.',
      },
      {
        title: 'Resuma sem exagerar',
        instruction:
          'Calcule uma medida simples, como média ou mediana, e diga exatamente a quais observações ela se refere.',
      },
      {
        title: 'Declare a incerteza',
        instruction:
          'Liste pelo menos um viés possível e escreva o que seria necessário para generalizar a conclusão.',
      },
    ],
    wrapUp:
      'Uma amostra não fala por todos automaticamente; seleção, medição e não resposta afetam o resultado.',
    sources: [
      {
        name: 'OpenStax Introductory Statistics 2e — Definitions and Key Terms',
        url: 'https://openstax.org/books/introductory-statistics-2e/pages/1-1-definitions-of-statistics-probability-and-key-terms',
      },
    ],
  },
  {
    id: 'euclids-prime-proof',
    title: 'Entenda por que os primos não terminam',
    field: 'Matemática · demonstração',
    durationMinutes: 8,
    description:
      'Reconstrua a prova de Euclides com uma lista imaginária de primos e confira cada passo do argumento.',
    materials: ['Papel e lápis', 'Conhecimento de multiplicação e divisibilidade'],
    steps: [
      {
        title: 'Imagine uma lista completa',
        instruction:
          'Suponha, apenas para testar a hipótese, que exista uma lista finita com todos os números primos.',
      },
      {
        title: 'Construa um número',
        instruction: 'Multiplique todos os primos da lista e some 1 ao resultado.',
      },
      {
        title: 'Teste os divisores listados',
        instruction:
          'Ao dividir o novo número por qualquer primo da lista, o resto é 1; portanto, nenhum primo listado o divide.',
      },
      {
        title: 'Feche o raciocínio',
        instruction:
          'Todo inteiro maior que 1 possui um divisor primo. Esse divisor não está na lista, o que contradiz a suposição inicial.',
      },
    ],
    wrapUp:
      'O número construído não precisa ser primo; basta que tenha um fator primo que não estava na lista.',
    sources: [
      {
        name: 'Harvey Mudd College — How Many Primes?',
        url: 'https://math.hmc.edu/funfacts/how-many-primes/',
      },
    ],
  },
  {
    id: 'connect-cell-to-genome',
    title: 'Ligue célula, molécula e genoma',
    field: 'Biologia · mapa de conceitos',
    durationMinutes: 8,
    description:
      'Crie um mapa simples que conecte níveis de organização biológica sem confundir uma sequência de referência com toda a diversidade humana.',
    materials: ['Papel e lápis', 'Artigos sobre células, DNA e genoma humano'],
    steps: [
      {
        title: 'Desenhe os níveis',
        instruction:
          'Escreva célula, moléculas, DNA e genoma em caixas separadas; evite desenhar uma escala como se cada termo fosse equivalente.',
      },
      {
        title: 'Conecte as funções',
        instruction:
          'Use setas e verbos para explicar como DNA e RNA participam do armazenamento e da transmissão de informação celular.',
      },
      {
        title: 'Inclua uma enzima',
        instruction:
          'Adicione uma nota sobre como enzimas aceleram reações sem serem consumidas nelas.',
      },
      {
        title: 'Anote o limite da referência',
        instruction:
          'Registre que uma sequência de referência ajuda a pesquisa, mas não é uma sequência idêntica para todas as pessoas.',
      },
    ],
    wrapUp:
      'O mapa fica mais preciso quando cada seta explica uma relação e cada escala mantém suas diferenças.',
    sources: [
      {
        name: 'NHGRI — The Human Genome Sequence Is Now Complete',
        url: 'https://www.genome.gov/about-nhgri/Director/genomics-landscape/april-7-2022-the-human-genome-sequence-is-now-complete',
      },
    ],
  },
  {
    id: 'test-an-engineering-idea',
    title: 'Transforme uma ideia em um teste',
    field: 'Engenharia · método',
    durationMinutes: 7,
    description:
      'Pratique transformar uma necessidade em requisito, critério de sucesso e teste que revele limites.',
    materials: ['Papel ou bloco de notas', 'Um objeto ou serviço cotidiano para melhorar'],
    steps: [
      {
        title: 'Descreva a necessidade',
        instruction:
          'Escreva quem enfrenta o problema e em que situação ele aparece. Evite começar por uma solução pronta.',
      },
      {
        title: 'Defina um requisito',
        instruction:
          'Formule algo que possa ser observado ou medido, como tempo, carga, segurança ou facilidade de uso.',
      },
      {
        title: 'Escolha um teste',
        instruction:
          'Descreva cenário, instrumento e resultado que contaria como sucesso. Inclua uma condição difícil de uso.',
      },
      {
        title: 'Registre limites e revisão',
        instruction:
          'Anote o que o teste não avaliou e que resultado faria você revisar o projeto.',
      },
    ],
    wrapUp:
      'Um teste responde a uma pergunta delimitada; ele não garante o desempenho do sistema em qualquer contexto.',
    sources: [
      {
        name: 'NASA — Systems Engineering Handbook',
        url: 'https://www.nasa.gov/reference/systems-engineering-handbook/',
      },
    ],
  },
];
