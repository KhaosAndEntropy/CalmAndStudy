import type { Topic } from '../types';

export const formalsciencesTopics: Topic[] = [
  {
    id: 'higgs-discovery',
    title: 'O bóson de Higgs foi detectado em 2012',
    field: 'Física de Partículas',
    period: 'CERN · 4 de julho de 2012',
    readingTime: 4,
    confidence: 96,
    confidenceLabel: 'Colaborações independentes',
    summary:
      'Dois experimentos no Grande Colisor de Hádrons observaram uma nova partícula compatível com o bóson previsto.',
    fact: 'ATLAS e CMS anunciaram em 2012 uma nova partícula e atingiram o limiar estatístico de cinco sigmas para chamar o resultado de descoberta.',
    detail:
      'O bóson é uma excitação do campo de Higgs. Como decai quase imediatamente, os detectores não o fotografam diretamente: equipes inferem sua presença pelos produtos do decaimento e por um excesso estatístico sobre o fundo esperado. A identificação e as propriedades continuaram a ser medidas após o anúncio.',
    sourceCount: 2,
    sources: [
      {
        name: 'CERN — How did we discover the Higgs boson?',
        url: 'https://home.cern/science/physics/higgs-boson/how',
        kind: 'Laboratório internacional · explicação do experimento',
      },
      {
        name: 'CERN — The Higgs boson',
        url: 'https://home.cern/science/physics/higgs-boson',
        kind: 'Laboratório internacional · física de partículas',
      },
    ],
    tags: ['partículas', 'estatística', 'LHC', 'campo de Higgs'],
  },
  {
    id: 'second-atomic',
    title: 'O segundo é definido contando oscilações do césio',
    field: 'Física',
    period: 'Sistema Internacional de Unidades',
    readingTime: 3,
    confidence: 95,
    confidenceLabel: 'Definição metrológica',
    summary:
      'Relógios atômicos usam uma frequência natural do átomo de césio-133 para medir intervalos com grande precisão.',
    fact: 'Um segundo corresponde a 9.192.631.770 períodos da radiação associada a uma transição específica do césio-133.',
    detail:
      'A definição internacional fixa esse número de ciclos por segundo. Um relógio atômico ajusta sua frequência à resposta dos átomos e conta as oscilações. Relógios ópticos já exploram frequências ainda maiores, mas a definição vigente do segundo continua ligada ao césio.',
    sourceCount: 1,
    sources: [
      {
        name: 'NIST — Definitions of the SI base units',
        url: 'https://www.nist.gov/si-redefinition/definitions-si-base-units',
        kind: 'Instituto de padrões e tecnologia · definição de unidade',
      },
    ],
    tags: ['tempo', 'unidades', 'césio', 'metrologia', 'relatividade'],
  },
  {
    id: 'ip-datagrams',
    title: 'A internet envia dados em pacotes independentes',
    field: 'Ciência da Computação',
    period: 'Protocolos de rede',
    readingTime: 4,
    confidence: 92,
    confidenceLabel: 'Especificação técnica primária',
    summary: 'O protocolo IP endereça datagramas para que atravessem redes interconectadas.',
    fact: 'O Internet Protocol define o envio de blocos chamados datagramas de uma origem a um destino; o protocolo IP, por si só, não garante entrega confiável nem ordenação.',
    detail:
      'Outras camadas podem fornecer serviços adicionais, como retransmissão e ordenação. Separar responsabilidades em protocolos permite que redes diferentes cooperem. O RFC 791 é a especificação histórica do IPv4; padrões posteriores atualizaram partes do protocolo, então ele é uma fonte primária sobre o desenho original, não um manual completo da internet atual.',
    sourceCount: 1,
    sources: [
      {
        name: 'RFC Editor — RFC 791: Internet Protocol',
        url: 'https://www.rfc-editor.org/rfc/rfc791.html',
        kind: 'Especificação técnica publicada',
      },
    ],
    tags: ['internet', 'redes', 'protocolos', 'dados'],
  },
  {
    id: 'logarithmic-scales',
    title: 'Escalas logarítmicas ajudam a comparar números muito diferentes',
    field: 'Matemática',
    period: 'Funções e escalas',
    readingTime: 4,
    confidence: 91,
    confidenceLabel: 'Livro didático aberto',
    summary: 'Em vez de somar sempre o mesmo valor, cada passo pode representar uma multiplicação.',
    fact: 'Escalas logarítmicas aparecem em medidas como pH, decibéis e magnitude de terremotos, que abrangem intervalos muito grandes.',
    detail:
      'Numa escala de base 10, avançar uma unidade significa multiplicar por dez a grandeza representada. Isso comprime valores enormes numa faixa legível, mas exige cuidado ao comparar diferenças: um ponto de diferença não significa simplesmente “um pouco mais”. A magnitude sísmica moderna também não deve ser confundida com uma única escala simples de Richter em todos os contextos.',
    sourceCount: 1,
    sources: [
      {
        name: 'OpenStax — Exponential and Logarithmic Functions',
        url: 'https://openstax.org/books/calculus-volume-1/pages/1-5-exponential-and-logarithmic-functions',
        kind: 'Livro universitário aberto · licença Creative Commons',
      },
    ],
    tags: ['logaritmos', 'decibéis', 'pH', 'terremotos'],
  },
  {
    id: 'periodic-pattern',
    title: 'A tabela periódica organiza elementos pelo número atômico',
    field: 'Química',
    period: 'Química moderna',
    readingTime: 4,
    confidence: 92,
    confidenceLabel: 'Livro didático aberto',
    summary: 'A posição de cada elemento revela padrões que ajudam a prever propriedades químicas.',
    fact: 'A tabela moderna organiza os elementos em ordem crescente de número atômico; elementos de uma mesma coluna tendem a compartilhar propriedades químicas.',
    detail:
      'No século XIX, Mendeleev e Meyer reconheceram periodicidades ao organizar os elementos conhecidos. Mendeleev deixou espaços e previu propriedades de elementos ainda não identificados. A explicação moderna se apoia na estrutura eletrônica dos átomos e na lei periódica baseada no número atômico, não apenas na massa.',
    sourceCount: 1,
    sources: [
      {
        name: 'OpenStax Chemistry 2e — The Periodic Table',
        url: 'https://openstax.org/books/chemistry-2e/pages/2-5-the-periodic-table',
        kind: 'Livro universitário aberto · licença Creative Commons',
      },
    ],
    tags: ['elementos', 'átomos', 'Mendeleev', 'propriedades químicas'],
  },
  {
    id: 'infinite-primes',
    title: 'Existem infinitos números primos — e há uma prova antiga',
    field: 'Matemática',
    period: 'Teoria dos números · Euclides',
    readingTime: 4,
    confidence: 96,
    confidenceLabel: 'Resultado demonstrado matematicamente',
    summary:
      'Uma ideia de Euclides mostra que nenhuma lista finita consegue conter todos os números primos.',
    fact: 'Se imaginarmos uma lista completa de primos, o produto deles mais um leva a uma contradição: algum primo novo precisa existir.',
    detail:
      'Suponha que todos os primos sejam p₁, p₂, …, pₙ. Multiplique-os e some 1. O novo número deixa resto 1 quando dividido por qualquer primo da lista; portanto, nenhum deles o divide. Como todo inteiro maior que 1 possui algum divisor primo, há um primo fora da lista — contradição. O número construído não precisa ser primo: basta que tenha um fator primo que não estava na lista. É uma demonstração por contradição, registrada nos Elementos de Euclides.',
    sourceCount: 2,
    sources: [
      {
        name: 'OpenStax — Prime and Composite Numbers',
        url: 'https://openstax.org/books/contemporary-mathematics/pages/3-1-prime-and-composite-numbers',
        kind: 'Livro didático aberto · matemática',
      },
      {
        name: 'Harvey Mudd College — How many Primes?',
        url: 'https://math.hmc.edu/funfacts/how-many-primes/',
        kind: 'Departamento universitário · demonstração de Euclides',
      },
    ],
    tags: ['números primos', 'provas', 'Euclides', 'teoria dos números'],
    recommendedBefore: [
      {
        topicId: 'logarithmic-scales',
        title: 'Escalas logarítmicas ajudam a comparar números muito diferentes',
        why: 'A leitura anterior revisa potências e escalas; aqui você usa multiplicação e divisibilidade para seguir uma demonstração.',
      },
    ],
  },
];
