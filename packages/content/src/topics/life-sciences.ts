import type { Topic } from '../types';

export const lifesciencesTopics: Topic[] = [
  {
    id: 'octopus',
    title: 'Polvos têm neurônios espalhados pelos braços',
    field: 'Biologia',
    period: 'Pesquisas contemporâneas',
    readingTime: 3,
    confidence: 93,
    confidenceLabel: 'Bem documentado',
    summary:
      'Grande parte do sistema nervoso do polvo está nos braços, que exploram o ambiente com autonomia.',
    fact: 'Os braços de um polvo contêm circuitos nervosos locais capazes de processar sinais sensoriais e coordenar movimentos sem esperar instruções detalhadas do cérebro central.',
    detail:
      'Isso não significa que cada braço tenha uma mente independente. O cérebro central integra informações e orienta comportamentos, enquanto redes neurais periféricas ajudam a executar movimentos complexos. A distribuição do sistema nervoso varia entre espécies e continua sendo objeto de estudo.',
    sourceCount: 3,
    sources: [
      {
        name: 'Current Biology — Repeating ultrastructural motifs in the octopus arm nervous system',
        url: 'https://doi.org/10.1016/j.cub.2024.09.007',
        kind: 'Pesquisa revisada por pares · acesso aberto',
      },
      {
        name: 'Nature Communications — Neuronal segmentation in cephalopod arms',
        url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC11736069/',
        kind: 'Pesquisa revisada por pares · texto integral aberto',
      },
      {
        name: 'Journal of Comparative Neurology — Motor control pathways in the octopus arm',
        url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC6478645/',
        kind: 'Pesquisa revisada por pares · texto integral aberto',
      },
    ],
    tags: ['neurociência', 'animais', 'comportamento'],
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Day_octopus_%28Octopus_cyanea%29_%2835595531524%29.jpg/960px-Day_octopus_%28Octopus_cyanea%29_%2835595531524%29.jpg',
      alt: 'Polvo-de-dia em recife nas Filipinas',
      credit: 'Derek Keats · CC BY 2.0',
      creditUrl:
        'https://commons.wikimedia.org/wiki/File:Day_octopus_(Octopus_cyanea)_(35595531524).jpg',
    },
  },
  {
    id: 'human-genome',
    title: 'A primeira sequência humana sem lacunas chegou em 2022',
    field: 'Genética',
    period: 'Projeto T2T · 2022',
    readingTime: 4,
    confidence: 92,
    confidenceLabel: 'Fonte institucional',
    summary:
      'Novas técnicas completaram trechos que faltavam na sequência de referência do genoma humano.',
    fact: 'A sequência completa publicada pelo consórcio Telomere-to-Telomere tem mais de 3 bilhões de pares de bases distribuídos por 23 cromossomos.',
    detail:
      'O marco ampliou a sequência de referência disponível para pesquisa, mas não representa uma sequência universal idêntica para todas as pessoas. A diversidade genética humana continua sendo estudada; uma referência melhor permite investigar regiões antes difíceis de montar e comparar.',
    sourceCount: 1,
    sources: [
      {
        name: 'NHGRI — The human genome sequence is now complete',
        url: 'https://www.genome.gov/about-nhgri/Director/genomics-landscape/april-7-2022-the-human-genome-sequence-is-now-complete',
        kind: 'Instituto Nacional de Pesquisa do Genoma Humano',
      },
    ],
    tags: ['DNA', 'genoma', 'cromossomos', 'biologia molecular'],
  },
  {
    id: 'fossilization-rare',
    title: 'Virar fóssil é uma exceção, não o destino normal',
    field: 'Paleontologia',
    period: 'Registro fóssil',
    readingTime: 3,
    confidence: 90,
    confidenceLabel: 'Material educativo institucional',
    summary:
      'O registro que os paleontólogos encontram preserva apenas uma pequena parte da vida passada.',
    fact: 'Fossilização depende de condições especiais de preservação; organismos enterrados rapidamente têm mais chance de deixar vestígios.',
    detail:
      'A decomposição, o transporte e a erosão apagam muitos restos antes que sejam incorporados aos sedimentos. Partes duras tendem a preservar melhor que tecidos moles, embora existam exceções extraordinárias. Por isso, o registro fóssil é valioso, mas incompleto: ausência de fóssil não prova que um organismo nunca existiu.',
    sourceCount: 1,
    sources: [
      {
        name: 'Smithsonian National Museum of Natural History — Fossilization',
        url: 'https://naturalhistory.si.edu/education/teaching-resources/paleontology/fossilization-how-fossils-form',
        kind: 'Museu de história natural · material educativo',
      },
    ],
    tags: ['fósseis', 'preservação', 'sedimentos', 'evolução'],
  },
  {
    id: 'photosynthesis-energy',
    title: 'A fotossíntese transforma energia luminosa em energia química',
    field: 'Botânica',
    period: 'Processos celulares',
    readingTime: 4,
    confidence: 93,
    confidenceLabel: 'Livro didático aberto',
    summary:
      'Plantas, algas e cianobactérias capturam luz e a usam para produzir moléculas orgânicas.',
    fact: 'Na fotossíntese, água e dióxido de carbono participam de processos que armazenam energia em açúcares; o oxigênio é liberado como produto.',
    detail:
      'Nas plantas, as etapas da fotossíntese ocorrem nos cloroplastos. As reações dependentes de luz produzem transportadores de energia; outras reações usam essa energia para incorporar carbono. Nem toda fixação de carbono depende de luz: alguns microrganismos usam energia química, por isso não se deve definir toda autotrofia como fotossíntese.',
    sourceCount: 1,
    sources: [
      {
        name: 'OpenStax Biology 2e — Overview of Photosynthesis',
        url: 'https://openstax.org/books/biology-2e/pages/8-1-overview-of-photosynthesis',
        kind: 'Livro universitário aberto · licença Creative Commons',
      },
    ],
    tags: ['plantas', 'energia', 'cloroplastos', 'ecologia'],
  },
  {
    id: 'antimicrobial-resistance',
    title: 'A resistência antimicrobiana surge nos microrganismos',
    field: 'Microbiologia',
    period: 'Evolução e saúde pública',
    readingTime: 5,
    confidence: 91,
    confidenceLabel: 'Síntese de saúde pública OMS/CDC',
    summary:
      'A exposição a medicamentos favorece a sobrevivência e a propagação de microrganismos resistentes.',
    fact: 'É o microrganismo — não o corpo da pessoa — que pode desenvolver resistência a medicamentos antimicrobianos.',
    detail:
      'Dentro de uma população microbiana há variações. Quando um medicamento elimina os microrganismos suscetíveis, variantes resistentes podem sobreviver e multiplicar-se; genes de resistência também podem espalhar-se entre microrganismos. O uso inadequado e excessivo de antimicrobianos e a transmissão de infecções contribuem para o problema. Antibióticos atuam contra bactérias, não contra vírus, e qualquer decisão de tratamento deve ser feita com profissionais de saúde.',
    sourceCount: 2,
    sources: [
      {
        name: 'CDC — About Antimicrobial Resistance',
        url: 'https://www.cdc.gov/antimicrobial-resistance/about/index.html',
        kind: 'Agência de saúde pública · mecanismo e contexto',
      },
      {
        name: 'OMS — Antimicrobial resistance',
        url: 'https://www.who.int/news-room/fact-sheets/detail/antimicrobial-resistance',
        kind: 'Organização Mundial da Saúde · síntese global',
      },
    ],
    tags: ['microrganismos', 'evolução', 'medicamentos', 'saúde pública'],
  },
];
