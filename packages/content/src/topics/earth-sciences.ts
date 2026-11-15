import type { Topic } from '../types';

export const earthsciencesTopics: Topic[] = [
  {
    id: 'ocean-heat',
    title: 'O oceano absorve a maior parte do excesso de calor',
    field: 'Oceanografia',
    period: 'Dados de 1971–2024',
    readingTime: 4,
    confidence: 93,
    confidenceLabel: 'Síntese institucional',
    summary: 'A água armazena calor por muito tempo e redistribui energia pelo planeta.',
    fact: 'Mais de 90% do excesso de calor acumulado no sistema climático da Terra foi absorvido pelos oceanos.',
    detail:
      'A NOAA descreve essa estimativa a partir de medições de conteúdo de calor oceânico. Correntes e mistura levam parte do calor para diferentes regiões e profundidades. Isso não significa que o oceano elimine o aquecimento: a energia armazenada pode voltar a influenciar a atmosfera, o nível do mar e os ecossistemas. O valor varia conforme o período e a profundidade considerados.',
    sourceCount: 1,
    sources: [
      {
        name: 'NOAA Climate.gov — Ocean heat content',
        url: 'https://prod-01-asg-www-climate.woc.noaa.gov/news-features/understanding-climate/climate-change-ocean-heat-content',
        kind: 'Agência científica · dados e síntese',
      },
    ],
    tags: ['clima', 'calor', 'correntes oceânicas', 'mudança climática'],
  },
  {
    id: 'earthquakes-plates',
    title: 'A maioria dos terremotos acontece perto dos limites das placas',
    field: 'Geologia',
    period: 'Processos geológicos',
    readingTime: 4,
    confidence: 94,
    confidenceLabel: 'Fonte institucional',
    summary:
      'A crosta terrestre é formada por placas em movimento lento, cujas bordas concentram muitas falhas.',
    fact: 'Muitos terremotos ocorrem quando uma falha, presa pelo atrito enquanto as placas se movem, rompe e libera energia em ondas sísmicas.',
    detail:
      'As placas tectônicas não deslizam suavemente em todos os pontos. Partes das bordas podem ficar travadas enquanto o movimento continua, acumulando deformação. Quando a falha se rompe, ondas sísmicas propagam a energia. Há também terremotos intraplaca, portanto nem todo evento acontece exatamente numa borda.',
    sourceCount: 1,
    sources: [
      {
        name: 'USGS — The Science of Earthquakes',
        url: 'https://www.usgs.gov/programs/earthquake-hazards/science-earthquakes',
        kind: 'Serviço geológico nacional · material educativo',
      },
    ],
    tags: ['terremotos', 'tectônica', 'falhas', 'ondas sísmicas'],
  },
  {
    id: 'water-cycle',
    title: 'A água circula entre oceanos, atmosfera e continentes',
    field: 'Hidrologia',
    period: 'Ciclo hidrológico',
    readingTime: 3,
    confidence: 92,
    confidenceLabel: 'Fonte institucional',
    summary:
      'Evaporação, condensação, precipitação e escoamento descrevem partes de um ciclo em movimento.',
    fact: 'A evaporação transfere água líquida para a atmosfera como vapor; ao condensar, o vapor forma gotículas que podem compor nuvens.',
    detail:
      'O ciclo não é uma sequência única: água pode infiltrar no solo, fluir em rios, ficar armazenada em gelo ou retornar ao oceano. A energia solar impulsiona a evaporação, e a gravidade move água de volta à superfície. A proporção entre evaporação e precipitação muda conforme região e estação.',
    sourceCount: 1,
    sources: [
      {
        name: 'USGS Water Science School — Condensation and the Water Cycle',
        url: 'https://www.usgs.gov/water-science-school/science/condensation-and-water-cycle',
        kind: 'Serviço geológico nacional · material educativo',
      },
    ],
    tags: ['água', 'nuvens', 'rios', 'clima'],
  },
  {
    id: 'enso-pacific',
    title: 'El Niño e La Niña são fases de um sistema oceano-atmosfera',
    field: 'Climatologia',
    period: 'Oscilação que varia ao longo dos anos',
    readingTime: 5,
    confidence: 92,
    confidenceLabel: 'Síntese institucional com ressalvas',
    summary:
      'Temperatura do Pacífico tropical e circulação atmosférica interagem e alteram probabilidades climáticas em várias regiões.',
    fact: 'El Niño e La Niña são fases quente e fria do ENSO; seus efeitos regionais variam e não determinam sozinhos o tempo de um lugar.',
    detail:
      'Em condições médias, ventos alísios empurram águas superficiais quentes para oeste e favorecem a subida de águas mais frias no Pacífico leste. Durante El Niño, esse padrão enfraquece; La Niña tende a reforçá-lo. A interação entre oceano e atmosfera muda padrões de chuva e temperatura, mas os impactos dependem da região, da estação e de outros fatores. Uma previsão sazonal expressa probabilidades, não uma certeza para cada cidade.',
    sourceCount: 2,
    sources: [
      {
        name: 'NOAA — Understanding El Niño & ENSO',
        url: 'https://www.noaa.gov/understanding-el-nino',
        kind: 'Agência científica · explicação do fenômeno',
      },
      {
        name: 'NOAA Ocean Service — What are El Niño and La Niña?',
        url: 'https://oceanservice.noaa.gov/facts/ninonina.html',
        kind: 'Agência científica · circulação oceânica',
      },
    ],
    tags: ['clima', 'Pacífico', 'oceano', 'atmosfera'],
    relatedTopics: ['ocean-heat', 'water-cycle'],
  },
  {
    id: 'groundwater-aquifers',
    title: 'Aquíferos são rochas e sedimentos que armazenam água',
    field: 'Hidrologia',
    period: 'Ciclo da água subterrânea',
    readingTime: 4,
    confidence: 91,
    confidenceLabel: 'Fonte institucional e dados hidrogeológicos',
    summary:
      'A água subterrânea ocupa poros e fraturas; não costuma formar rios ou lagos vazios dentro de cavernas.',
    fact: 'Um aquífero é uma formação geológica capaz de armazenar e transmitir água subterrânea em quantidade útil.',
    detail:
      'Depois da infiltração, parte da água atravessa o solo até uma zona saturada. A água pode preencher poros entre grãos ou fraturas na rocha. A facilidade de extração depende da permeabilidade, da recarga e das condições locais; nem todo depósito subterrâneo é um aquífero produtivo. Poços podem retirar água mais depressa do que ela é reposta, e a contaminação pode persistir por muito tempo.',
    sourceCount: 2,
    sources: [
      {
        name: 'USGS Water Science School — Aquifers and Groundwater',
        url: 'https://www.usgs.gov/water-science-school/science/aquifers-and-groundwater',
        kind: 'Serviço geológico nacional · hidrologia',
      },
      {
        name: 'USGS Water Science School — What is Groundwater?',
        url: 'https://www.usgs.gov/water-science-school/science/groundwater-what-groundwater',
        kind: 'Serviço geológico nacional · ciclo subterrâneo',
      },
    ],
    tags: ['água subterrânea', 'solo', 'rochas', 'recarga'],
    recommendedBefore: [
      {
        topicId: 'water-cycle',
        title: 'A água circula entre oceanos, atmosfera e continentes',
        why: 'A infiltração e a recarga dos aquíferos fazem parte do ciclo hidrológico apresentado nesse artigo.',
      },
    ],
  },
  {
    id: 'ocean-acidification',
    title: 'Mais CO₂ no mar altera a química da água',
    field: 'Oceanografia',
    period: 'Desde a Revolução Industrial',
    readingTime: 4,
    confidence: 92,
    confidenceLabel: 'Síntese institucional apoiada por monitoramento',
    summary:
      'Quando o oceano absorve dióxido de carbono, reações químicas reduzem o pH e mudam a disponibilidade de carbonato.',
    fact: 'A acidificação oceânica é uma queda de longo prazo do pH, causada principalmente pela absorção de CO₂ atmosférico.',
    detail:
      'O termo não significa que o oceano inteiro já tenha pH abaixo de 7: a água do mar continua alcalina em média, mas ficou menos alcalina. O CO₂ dissolvido participa de reações que elevam a concentração de íons de hidrogênio e reduzem íons carbonato, importantes para organismos que constroem conchas e esqueletos. Respostas biológicas variam entre espécies e condições locais; aquecimento e acidificação são processos relacionados ao CO₂, mas não são a mesma mudança.',
    sourceCount: 2,
    sources: [
      {
        name: 'NOAA Ocean Acidification Program — What is Ocean Acidification?',
        url: 'https://oceanacidification.noaa.gov/what-is-ocean-acidification/',
        kind: 'Programa científico · química do oceano',
      },
      {
        name: 'NOAA Ocean Service — What is Ocean Acidification?',
        url: 'https://oceanservice.noaa.gov/facts/acidification.html',
        kind: 'Agência científica · explicação e impactos',
      },
    ],
    tags: ['química', 'oceano', 'pH', 'carbono', 'ecossistemas'],
    recommendedBefore: [
      {
        topicId: 'ocean-heat',
        title: 'O oceano absorve a maior parte do excesso de calor',
        why: 'Esse artigo introduz como o oceano interage com mudanças no sistema climático; aqui o foco passa do calor para a química.',
      },
    ],
  },
];
