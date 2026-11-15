import { useState } from 'react';

const glossary: Record<string, string> = {
  'acesso aberto':
    'O texto pode ser lido gratuitamente na página indicada. Isso não significa que possa ser copiado ou republicado sem respeitar a licença.',
  aquífero:
    'Formação de rochas ou sedimentos que armazena e permite a circulação de água subterrânea.',
  arqueobotânica:
    'Área que estuda restos de plantas encontrados em contextos arqueológicos para compreender alimentação, cultivo e ambiente.',
  atmosfera: 'Camada de gases que envolve um planeta ou outro corpo celeste.',
  átomo: 'Unidade básica da matéria formada por um núcleo e elétrons ao seu redor.',
  'ciclo de Calvin':
    'Conjunto de reações em que organismos fotossintéticos incorporam carbono para formar moléculas orgânicas.',
  'ciclo hidrológico':
    'Circulação contínua da água entre oceanos, atmosfera, rios, solos, gelo e seres vivos.',
  'controle de fluxo':
    'Mecanismo que evita que um equipamento envie dados mais rápido do que o outro consegue receber.',
  'dia sideral':
    'Tempo que um planeta leva para completar uma rotação em relação às estrelas distantes.',
  'dia solar': 'Intervalo entre duas passagens aparentes do Sol pelo mesmo ponto do céu local.',
  datagrama:
    'Pacote de dados enviado pela rede sem que o protocolo IP garanta sozinho entrega ou ordem.',
  'desequilíbrio energético':
    'Diferença entre a energia que a Terra recebe do Sol e a energia que devolve ao espaço.',
  DOI: 'Identificador permanente usado para localizar um artigo ou outro documento digital, mesmo se o endereço mudar.',
  ENSO: 'Sigla em inglês para El Niño–Oscilação Sul, um padrão de interação entre o oceano Pacífico tropical e a atmosfera.',
  'escape atmosférico':
    'Perda de gases de uma atmosfera para o espaço, influenciada por processos físicos e pela gravidade.',
  evidência:
    'Observação, dado ou registro usado para avaliar uma explicação. Uma evidência precisa ser interpretada no seu contexto.',
  'falha geológica': 'Fratura na crosta terrestre ao longo da qual blocos de rocha podem se mover.',
  fotossíntese:
    'Processo pelo qual plantas, algas e algumas bactérias usam energia luminosa para produzir moléculas orgânicas.',
  'genoma de referência':
    'Sequência de DNA usada como guia para comparar e localizar partes de genomas; não representa toda a diversidade humana.',
  'hipótese científica':
    'Explicação provisória que pode ser confrontada com observações ou experimentos.',
  'índice de preços':
    'Medida que acompanha a variação de preços de um conjunto de bens e serviços ao longo do tempo.',
  'licença de reutilização':
    'Conjunto de permissões e condições para copiar, adaptar ou redistribuir uma obra. É diferente de poder apenas consultá-la.',
  'magnitude sísmica':
    'Medida relacionada ao tamanho de um terremoto; diferentes escalas descrevem aspectos diferentes do evento.',
  'matéria orgânica':
    'Material formado principalmente por compostos de carbono, presente nos seres vivos e em seus restos.',
  'método científico':
    'Conjunto de práticas para formular perguntas, reunir evidências, testar explicações e comunicar limites; não é uma receita única.',
  metadados:
    'Informações que descrevem um documento, como título, autoria, data, periódico e identificador.',
  'modelo científico':
    'Representação simplificada usada para explicar fenômenos e produzir previsões que podem ser testadas.',
  molécula: 'Conjunto de átomos unidos por ligações químicas.',
  'período orbital': 'Tempo que um corpo leva para completar uma volta ao redor de outro.',
  'revisão por pares':
    'Avaliação de um trabalho por especialistas antes ou depois da publicação; ajuda no controle de qualidade, mas não garante que tudo esteja correto.',
  rotação: 'Giro de um corpo em torno de um eixo próprio.',
  seleção:
    'Processo em que algumas características se tornam mais comuns porque influenciam sobrevivência ou reprodução em determinado ambiente.',
  'texto integral': 'O documento completo, além do título, resumo ou ficha bibliográfica.',
  'versão aceita':
    'Manuscrito aprovado pelo periódico após avaliação, geralmente antes da diagramação final.',
  'versão publicada':
    'Versão final disponibilizada pelo periódico, que pode ter uma licença específica de reutilização.',
  'zona saturada':
    'Parte do solo ou da rocha em que os espaços disponíveis estão preenchidos por água.',
};

const terms = Object.keys(glossary).sort((left, right) => right.length - left.length);
const escapeRegExp = (term: string) => term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const termPattern = new RegExp(
  `(?<![\\p{L}\\p{N}])(${terms.map(escapeRegExp).join('|')})(?![\\p{L}\\p{N}])`,
  'giu',
);

type GlossaryTextProps = {
  children: string;
};

/** Adds small, optional definitions to technical vocabulary in article prose. */
export function GlossaryText({ children }: GlossaryTextProps) {
  const [openTerm, setOpenTerm] = useState<string | null>(null);
  const parts = children.split(termPattern);

  return (
    <>
      {parts.map((part, index) => {
        const matchedTerm = terms.find(
          term => term.toLocaleLowerCase('pt-BR') === part.toLocaleLowerCase('pt-BR'),
        );
        if (!matchedTerm) return <span key={`${index}-${part}`}>{part}</span>;

        const id = `glossary-${index}-${matchedTerm.replace(/\s+/g, '-')}`;
        const isOpen = openTerm === id;
        return (
          <span className="glossary-term-wrap" key={`${id}-${part}`}>
            <button
              aria-describedby={id}
              aria-expanded={isOpen}
              aria-label={`Explicação de ${part}`}
              className="glossary-term"
              onClick={() => setOpenTerm(current => (current === id ? null : id))}
              onKeyDown={event => {
                if (event.key === 'Escape') setOpenTerm(null);
              }}
              onBlur={() => setOpenTerm(null)}
              type="button"
            >
              {part}
            </button>
            <span className="glossary-tooltip" id={id} role="tooltip">
              <strong>{matchedTerm}</strong> — {glossary[matchedTerm]}
            </span>
          </span>
        );
      })}
    </>
  );
}
