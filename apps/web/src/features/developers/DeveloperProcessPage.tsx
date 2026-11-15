import { useState } from 'react';
import {
  BookOpen,
  Code2,
  GitBranch,
  Lightbulb,
  ShieldCheck,
  Sparkles,
  Workflow,
} from 'lucide-react';
import type { LearningMode } from '../preferences/learning-mode';
import './developer-process.css';

type Language = 'pt' | 'en' | 'es';
type Front = 'creative' | 'technical';

const copy = {
  pt: {
    eyebrow: 'BASTIDORES DO PROJETO',
    title: 'Como esta sala foi pensada e construída',
    intro:
      'Uma visão direta das ideias, das decisões e do caminho técnico. O conteúdo e os critérios de verificação são os mesmos nos dois modos.',
    creative: 'Processo criativo',
    technical: 'Processo técnico',
    who: 'De quem veio cada parte',
    timeline: 'Linha do tempo das ideias',
    map: 'Mapa do funcionamento',
    flow: 'Como uma pauta pode virar conteúdo',
    ai: 'Como a IA foi utilizada',
    limits: 'O que esta documentação não promete',
    userLabel: 'Criador do projeto',
    aiLabel: 'Assistente de IA',
    userOrigin: 'Ideia e decisão do criador',
    aiOrigin: 'Sugestão ou apoio da IA, sujeito à escolha humana',
    assistantSuggestion: 'A IA sugeriu; o criador decidiu',
    tabLabel: 'Frentes de documentação',
    relatedDocs: 'Documentos relacionados',
    architectureDoc: 'Arquitetura',
    editorialDoc: 'Critério editorial',
    processDoc: 'Guia completo do processo',
    contributeDoc: 'Como contribuir',
    phases: [
      [
        'A ideia inicial',
        'Criar um lugar acolhedor para descobrir conhecimentos em artigos curtos, por sorteio ou por assunto escolhido.',
        'creator',
      ],
      [
        'A escolha do nome atual',
        'A IA sugeriu o nome inicial. O criador decidiu adotá-lo por sua representação feminina e acolhedora, para um espaço destinado a qualquer pessoa.',
        'assistant',
      ],
      [
        'Aprender com contexto',
        'O criador propôs trilhas, tutoriais, recomendações e exercícios para relacionar os assuntos sem obrigar uma ordem de leitura.',
        'creator',
      ],
      [
        'Dois ritmos',
        'O criador escolheu oferecer estudo calmo e modo aventura com navegação e apresentação próprias, mantendo os mesmos conteúdos e critérios.',
        'creator',
      ],
      [
        'Acolhimento e autonomia',
        'O criador pediu recursos opcionais de conforto, acessibilidade, pausas e acolhimento. Eles não diagnosticam nem substituem ajuda profissional.',
        'creator',
      ],
      [
        'Origem brasileira, fontes diversas',
        'O projeto foi criado e é desenvolvido por uma pessoa brasileira. A pesquisa de conhecimento não fica restrita ao Brasil: pode usar fontes públicas confiáveis de diferentes países, avaliadas pelos mesmos critérios.',
        'creator',
      ],
      [
        'Um projeto aberto',
        'O criador decidiu tornar o código aberto e gratuito, com documentação pública e espaço para contribuições.',
        'creator',
      ],
    ],
    creativeNote:
      'A direção do produto, as prioridades e as decisões finais são do criador. A IA ajudou a explorar alternativas, organizar ideias e transformar pedidos em propostas implementáveis; o criador revisou, ajustou e escolheu o que seguir.',
    techNodes: [
      [
        'Pessoa',
        'Escolhe modo, tema e ritmo; preferências e progresso de estudo ficam no navegador.',
      ],
      ['Aplicação web', 'React + Vite; interface responsiva e instalável como PWA.'],
      [
        'Conteúdo compartilhado',
        'Pacote do monorepo mantém artigos, trilhas, tutoriais, relações e exercícios.',
      ],
      [
        'API leve',
        'Cloudflare Pages Functions encaminha busca de fontes, sugestões e estatísticas agregadas.',
      ],
      [
        'Fontes públicas',
        'Adaptadores consultam catálogos; limites de acesso e procedência são verificados antes de exibir um resultado.',
      ],
      [
        'D1',
        'Armazena sugestões para revisão e alguns dados agregados; não publica artigos automaticamente.',
      ],
    ],
    flowNodes: [
      ['Descoberta', 'Catálogos ajudam a localizar publicações.'],
      [
        'Triagem técnica',
        'DOI, tipo, licença, direitos e texto integral são checados quando aplicável.',
      ],
      [
        'Revisão humana',
        'Uma pessoa lê as fontes, confere se sustentam as afirmações e verifica independência.',
      ],
      [
        'Publicação editorial',
        'Só após revisão e registro explícito no catálogo; busca automática não altera o site.',
      ],
    ],
    aiText:
      'A IA foi usada como parceira de ideação, apoio à programação, organização de documentação, revisão de interface e exploração de fontes. Ela não é uma autoridade científica, não certifica a verdade, não substitui leitura crítica e não publica artigos sozinha. As sugestões de código e conteúdo precisam de revisão humana.',
    limitations:
      'Esta linha do tempo resume decisões relatadas durante o desenvolvimento; não é uma auditoria de cada conversa ou commit. A arquitetura pode mudar. O catálogo atual ainda contém materiais legados que não têm dossiê editorial completo; a busca verifica acesso e metadados, não prova a verdade de afirmações. OpenAIRE é um agregador e não conta como evidência independente.',
    mapCaption:
      'As setas mostram o percurso dos dados; não significam que a automação aprove ou publique conteúdo.',
    selectLanguage: 'Idioma desta página',
    adventure: 'Expedição de ideias',
    calm: 'Um olhar tranquilo pelos bastidores',
  },
  en: {
    eyebrow: 'PROJECT NOTES',
    title: 'How this learning space was imagined and built',
    intro:
      'A plain view of the ideas, decisions, and technical path. Both modes share the same content and verification standards.',
    creative: 'Creative process',
    technical: 'Technical process',
    who: 'Who contributed what',
    timeline: 'Idea timeline',
    map: 'How the system works',
    flow: 'How a topic can become published content',
    ai: 'How AI was used',
    limits: 'What this page does not claim',
    userLabel: 'Project creator',
    aiLabel: 'AI assistant',
    userOrigin: 'Creator idea and decision',
    aiOrigin: 'AI suggestion or assistance, subject to human choice',
    assistantSuggestion: 'AI suggested; creator decided',
    tabLabel: 'Documentation sections',
    relatedDocs: 'Related documents',
    architectureDoc: 'Architecture',
    editorialDoc: 'Editorial standard',
    processDoc: 'Full process guide',
    contributeDoc: 'How to contribute',
    phases: [
      [
        'The starting idea',
        'Create a welcoming place to discover knowledge through short articles, random picks, or chosen topics.',
        'creator',
      ],
      [
        'Choosing the current name',
        'The AI assistant suggested the initial name. The creator chose it for its feminine and welcoming representation, while keeping the space open to everyone.',
        'assistant',
      ],
      [
        'Learning with context',
        'The creator proposed trails, tutorials, recommendations, and exercises that connect topics without forcing a reading order.',
        'creator',
      ],
      [
        'Two learning rhythms',
        'The creator chose calm study and adventure mode with distinct navigation and presentation, while keeping the same content and standards.',
        'creator',
      ],
      [
        'Care and autonomy',
        'The creator requested optional comfort, accessibility, breaks, and supportive messages. They do not diagnose or replace professional help.',
        'creator',
      ],
      [
        'Brazilian origin, diverse sources',
        'The project was created and is developed by a Brazilian creator. Research is not limited to Brazil: it may use reliable public sources from different countries under the same criteria.',
        'creator',
      ],
      [
        'An open project',
        'The creator chose open-source code, free access, public documentation, and a path for contributions.',
        'creator',
      ],
    ],
    creativeNote:
      'Product direction, priorities, and final decisions belong to the creator. AI helped explore options, organize ideas, and turn requests into implementable proposals; the creator reviewed and chose what to pursue.',
    techNodes: [
      [
        'Person',
        'Chooses mode, topic, and pace; preferences and study progress stay in the browser.',
      ],
      ['Web app', 'React + Vite; responsive interface, installable as a PWA.'],
      [
        'Shared content',
        'A monorepo package holds articles, trails, tutorials, links, and exercises.',
      ],
      [
        'Lightweight API',
        'Cloudflare Pages Functions routes source search, suggestions, and aggregated statistics.',
      ],
      [
        'Public catalogs',
        'Adapters query catalogs; access and provenance checks run before a result is shown.',
      ],
      [
        'D1',
        'Stores suggestions for review and some aggregate data; it never publishes articles automatically.',
      ],
    ],
    flowNodes: [
      ['Discovery', 'Catalogs help locate publications.'],
      [
        'Technical screening',
        'DOI, type, license, rights, and full text are checked where applicable.',
      ],
      ['Human review', 'A person reads the sources and checks support and independence.'],
      [
        'Editorial publication',
        'Only after review and explicit addition to the catalog; automated search never changes the site.',
      ],
    ],
    aiText:
      'AI supported brainstorming, coding, documentation, interface review, and source exploration. It is not a scientific authority, does not certify truth, cannot replace critical reading, and does not publish articles by itself. AI-generated code and content require human review.',
    limitations:
      'This timeline summarizes decisions reported during development; it is not an audit of every conversation or commit. Architecture can change. The current catalog still includes legacy material without a complete editorial dossier; search checks access and metadata, not whether claims are true. OpenAIRE is an aggregator and does not count as independent evidence.',
    mapCaption: 'Arrows show data flow; they do not mean automation approves or publishes content.',
    selectLanguage: 'Page language',
    adventure: 'Ideas expedition',
    calm: 'A calm look behind the scenes',
  },
  es: {
    eyebrow: 'DETRÁS DEL PROYECTO',
    title: 'Cómo se imaginó y construyó este espacio de estudio',
    intro:
      'Una explicación clara de las ideas, decisiones y el recorrido técnico. Ambos modos comparten contenidos y criterios de verificación.',
    creative: 'Proceso creativo',
    technical: 'Proceso técnico',
    who: 'Quién aportó cada parte',
    timeline: 'Línea de tiempo de las ideas',
    map: 'Cómo funciona el sistema',
    flow: 'Cómo un tema puede convertirse en contenido',
    ai: 'Cómo se utilizó la IA',
    limits: 'Lo que esta página no afirma',
    userLabel: 'Creador del proyecto',
    aiLabel: 'Asistente de IA',
    userOrigin: 'Idea y decisión del creador',
    aiOrigin: 'Sugerencia o apoyo de IA, sujeto a elección humana',
    assistantSuggestion: 'La IA sugirió; el creador decidió',
    tabLabel: 'Secciones de documentación',
    relatedDocs: 'Documentos relacionados',
    architectureDoc: 'Arquitectura',
    editorialDoc: 'Criterio editorial',
    processDoc: 'Guía completa del proceso',
    contributeDoc: 'Cómo contribuir',
    phases: [
      [
        'La idea inicial',
        'Crear un espacio acogedor para descubrir conocimientos mediante artículos breves, al azar o por tema elegido.',
        'creator',
      ],
      [
        'La elección del nombre actual',
        'El asistente de IA propuso el nombre inicial. El creador decidió adoptarlo por su representación femenina y acogedora, para un espacio abierto a todas las personas.',
        'assistant',
      ],
      [
        'Aprender con contexto',
        'El creador propuso rutas, tutoriales, recomendaciones y ejercicios que conectan temas sin imponer un orden.',
        'creator',
      ],
      [
        'Dos ritmos de estudio',
        'El creador eligió estudio tranquilo y modo aventura con navegación propia, manteniendo el mismo contenido y criterios.',
        'creator',
      ],
      [
        'Cuidado y autonomía',
        'El creador pidió opciones de comodidad, accesibilidad, pausas y apoyo. No diagnostican ni sustituyen ayuda profesional.',
        'creator',
      ],
      [
        'Origen brasileño, fuentes diversas',
        'El proyecto fue creado y es desarrollado por una persona brasileña. La investigación no se limita a Brasil: puede usar fuentes públicas confiables de distintos países con los mismos criterios.',
        'creator',
      ],
      [
        'Un proyecto abierto',
        'El creador decidió abrir el código y el acceso, documentarlo públicamente y permitir contribuciones.',
        'creator',
      ],
    ],
    creativeNote:
      'La dirección del producto, las prioridades y las decisiones finales pertenecen al creador. La IA ayudó a explorar alternativas, organizar ideas y convertir solicitudes en propuestas implementables; el creador revisó y eligió qué seguir.',
    techNodes: [
      [
        'Persona',
        'Elige modo, tema y ritmo; las preferencias y el progreso quedan en el navegador.',
      ],
      ['Aplicación web', 'React + Vite; interfaz adaptable e instalable como PWA.'],
      [
        'Contenido compartido',
        'Un paquete del monorepo contiene artículos, rutas, tutoriales, relaciones y ejercicios.',
      ],
      [
        'API ligera',
        'Cloudflare Pages Functions conecta búsqueda de fuentes, sugerencias y estadísticas agregadas.',
      ],
      [
        'Catálogos públicos',
        'Los adaptadores consultan catálogos y comprueban acceso y procedencia antes de mostrar resultados.',
      ],
      [
        'D1',
        'Guarda sugerencias para revisión y algunos datos agregados; nunca publica artículos automáticamente.',
      ],
    ],
    flowNodes: [
      ['Descubrimiento', 'Los catálogos ayudan a localizar publicaciones.'],
      [
        'Filtro técnico',
        'DOI, tipo, licencia, derechos y texto completo se comprueban cuando corresponde.',
      ],
      ['Revisión humana', 'Una persona lee las fuentes y verifica apoyo e independencia.'],
      [
        'Publicación editorial',
        'Solo tras revisión y registro explícito en el catálogo; la búsqueda automática no cambia el sitio.',
      ],
    ],
    aiText:
      'La IA apoyó la ideación, programación, documentación, revisión de interfaz y exploración de fuentes. No es autoridad científica, no certifica la verdad, no sustituye la lectura crítica ni publica artículos por sí sola. El código y contenido sugeridos requieren revisión humana.',
    limitations:
      'Esta línea de tiempo resume decisiones comunicadas durante el desarrollo; no audita cada conversación o commit. La arquitectura puede cambiar. El catálogo aún contiene materiales heredados sin expediente editorial completo; la búsqueda verifica acceso y metadatos, no la verdad de las afirmaciones. OpenAIRE es un agregador y no cuenta como evidencia independiente.',
    mapCaption:
      'Las flechas muestran el flujo de datos; no significan que la automatización apruebe o publique contenido.',
    selectLanguage: 'Idioma de esta página',
    adventure: 'Expedición de ideas',
    calm: 'Una mirada tranquila entre bastidores',
  },
} as const;

export function DeveloperProcessPage({ mode }: { mode: LearningMode }) {
  const [language, setLanguage] = useState<Language>('pt');
  const [front, setFront] = useState<Front>('creative');
  const text = copy[language];
  const adventure = mode === 'adventure';

  return (
    <main className={`developer-process ${adventure ? 'is-adventure' : 'is-calm'}`}>
      <header className="developer-process-hero">
        <div className="developer-process-heading">
          <span className="eyebrow">
            <Workflow size={15} aria-hidden="true" /> {text.eyebrow}
          </span>
          <h1>{text.title}</h1>
          <p>{text.intro}</p>
          <span className="developer-mode-note">{adventure ? text.adventure : text.calm}</span>
        </div>
        <label className="developer-language">
          {text.selectLanguage}
          <select value={language} onChange={event => setLanguage(event.target.value as Language)}>
            <option value="pt">Português</option>
            <option value="en">English</option>
            <option value="es">Español</option>
          </select>
        </label>
      </header>

      <div className="developer-process-tabs" role="group" aria-label={text.tabLabel}>
        <button
          type="button"
          aria-pressed={front === 'creative'}
          onClick={() => setFront('creative')}
        >
          <Lightbulb size={17} aria-hidden="true" /> {text.creative}
        </button>
        <button
          type="button"
          aria-pressed={front === 'technical'}
          onClick={() => setFront('technical')}
        >
          <Code2 size={17} aria-hidden="true" /> {text.technical}
        </button>
      </div>

      {front === 'creative' ? (
        <div className="developer-process-content">
          <section className="developer-section" aria-labelledby="developer-who-title">
            <div className="developer-section-title">
              <Sparkles size={19} aria-hidden="true" />
              <div>
                <span>{text.who}</span>
                <h2 id="developer-who-title">{text.timeline}</h2>
              </div>
            </div>
            <div className="developer-origin-grid">
              <article>
                <strong>{text.userLabel}</strong>
                <p>{text.userOrigin}</p>
              </article>
              <article>
                <strong>{text.aiLabel}</strong>
                <p>{text.aiOrigin}</p>
              </article>
            </div>
            <ol className="developer-timeline">
              {text.phases.map(([title, description, origin], index) => (
                <li key={title}>
                  <span className="developer-timeline-number">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h3>{title}</h3>
                    <p>{description}</p>
                  </div>
                  <span className="developer-origin-tag">
                    {origin === 'assistant' ? text.assistantSuggestion : text.userLabel}
                  </span>
                </li>
              ))}
            </ol>
            <p className="developer-note">
              <Lightbulb size={17} aria-hidden="true" />
              {text.creativeNote}
            </p>
          </section>
          <section className="developer-section developer-ai-section">
            <div className="developer-section-title">
              <Sparkles size={19} aria-hidden="true" />
              <div>
                <span>{text.aiLabel}</span>
                <h2>{text.ai}</h2>
              </div>
            </div>
            <p>{text.aiText}</p>
          </section>
        </div>
      ) : (
        <div className="developer-process-content">
          <section className="developer-section" aria-labelledby="developer-map-title">
            <div className="developer-section-title">
              <Workflow size={19} aria-hidden="true" />
              <div>
                <span>{text.technical}</span>
                <h2 id="developer-map-title">{text.map}</h2>
              </div>
            </div>
            <ol className="developer-system-map">
              {text.techNodes.map(([title, description], index) => (
                <li key={title}>
                  <span className="developer-map-icon" aria-hidden="true">
                    {index + 1}
                  </span>
                  <div>
                    <h3>{title}</h3>
                    <p>{description}</p>
                  </div>
                  {index < text.techNodes.length - 1 && (
                    <span className="developer-map-arrow" aria-hidden="true">
                      ↓
                    </span>
                  )}
                </li>
              ))}
            </ol>
            <p className="developer-map-caption">{text.mapCaption}</p>
          </section>
          <section className="developer-section">
            <div className="developer-section-title">
              <GitBranch size={19} aria-hidden="true" />
              <div>
                <span>{text.technical}</span>
                <h2>{text.flow}</h2>
              </div>
            </div>
            <ol className="developer-editorial-flow">
              {text.flowNodes.map(([title, description], index) => (
                <li key={title}>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <div>
                    <h3>{title}</h3>
                    <p>{description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>
          <section className="developer-section developer-ai-section">
            <div className="developer-section-title">
              <ShieldCheck size={19} aria-hidden="true" />
              <div>
                <span>{text.aiLabel}</span>
                <h2>{text.limits}</h2>
              </div>
            </div>
            <p>{text.limitations}</p>
          </section>
          <div className="developer-doc-links">
            <BookOpen size={18} aria-hidden="true" />
            <span>{text.relatedDocs}</span>
            <a
              href="https://github.com/KhaosAndEntropy/CalmAndStudy/blob/main/docs/ARQUITETURA_ATUAL.md"
              target="_blank"
              rel="noreferrer"
            >
              {text.architectureDoc}
            </a>
            <a
              href="https://github.com/KhaosAndEntropy/CalmAndStudy/blob/main/docs/FLUXO_EDITORIAL.md"
              target="_blank"
              rel="noreferrer"
            >
              {text.editorialDoc}
            </a>
            <a
              href="https://github.com/KhaosAndEntropy/CalmAndStudy/blob/main/docs/PROCESSO_DO_PROJETO.md"
              target="_blank"
              rel="noreferrer"
            >
              {text.processDoc}
            </a>
            <a
              href="https://github.com/KhaosAndEntropy/CalmAndStudy/blob/main/CONTRIBUTING.md"
              target="_blank"
              rel="noreferrer"
            >
              {text.contributeDoc}
            </a>
          </div>
        </div>
      )}
    </main>
  );
}

export default DeveloperProcessPage;
