import { useMemo, useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  ExternalLink,
  GitBranch,
  GraduationCap,
  Lightbulb,
  ListOrdered,
  Network,
  Sparkles,
  Trees,
} from 'lucide-react';
import {
  bnccHighSchoolSourceUrl,
  bnccSourceUrl,
  pilotSkillRelations,
  pilotSkills,
  schoolStages,
  type SchoolStageId,
} from './school-curriculum';
import './school-mode.css';

type RelationshipView = 'sequence' | 'tree' | 'graph';

const relationshipViewOptions: {
  id: RelationshipView;
  label: string;
  icon: typeof ListOrdered;
}[] = [
  { id: 'sequence', label: 'Sequência', icon: ListOrdered },
  { id: 'tree', label: 'Árvore', icon: Trees },
  { id: 'graph', label: 'Grafo', icon: Network },
];

export function SchoolModePage() {
  const [stageId, setStageId] = useState<SchoolStageId>('fundamental-inicial');
  const [year, setYear] = useState(schoolStages[0].years[0]?.value ?? '1');
  const [subject, setSubject] = useState('Matemática');
  const [relationshipView, setRelationshipView] = useState<RelationshipView>('sequence');
  const currentStage = schoolStages.find(option => option.id === stageId) ?? schoolStages[0];
  const currentYear = currentStage.years.some(option => option.value === year)
    ? year
    : (currentStage.years[0]?.value ?? '1');
  const currentSubject = currentStage.subjects.includes(subject)
    ? subject
    : (currentStage.subjects[0] ?? '');
  const skill = useMemo(
    () =>
      pilotSkills.find(
        item =>
          item.stage === stageId &&
          (item.year === currentYear || item.year === '1-3') &&
          item.subject === currentSubject,
      ),
    [stageId, currentYear, currentSubject],
  );

  const changeStage = (value: string) => {
    const nextStage = schoolStages.find(option => option.id === value);
    if (!nextStage) return;
    setStageId(nextStage.id);
    setYear(nextStage.years[0]?.value ?? '1');
    setSubject(nextStage.subjects[0] ?? '');
  };

  const applySample = (sample: (typeof pilotSkills)[number]) => {
    setStageId(sample.stage);
    setYear(sample.year);
    setSubject(sample.subject);
  };

  const sourceUrl = stageId === 'medio' ? bnccHighSchoolSourceUrl : bnccSourceUrl;
  const relationByPair = new Map(
    pilotSkillRelations.map(relation => [`${relation.from}:${relation.to}`, relation]),
  );

  const renderSkillNode = (sample: (typeof pilotSkills)[number]) => {
    const sampleStage = schoolStages.find(option => option.id === sample.stage);
    const selected = skill?.code === sample.code;
    return (
      <button
        className={`school-relation-node ${selected ? 'is-selected' : ''}`}
        key={sample.code}
        type="button"
        aria-pressed={selected}
        onClick={() => applySample(sample)}
      >
        <code>{sample.code}</code>
        <b>{sample.title}</b>
        <small>
          {sampleStage?.label}
          {sample.yearLabel ? ` · ${sample.yearLabel}` : ''} · {sample.subject}
        </small>
      </button>
    );
  };

  return (
    <div className="school-page" aria-labelledby="school-title">
      <section className="school-hero">
        <div className="school-hero-copy">
          <span className="school-eyebrow">
            <GraduationCap size={15} aria-hidden="true" />
            <span className="school-brazil-flag" role="img" aria-label="Projeto brasileiro">
              <svg viewBox="0 0 60 42" aria-hidden="true" focusable="false">
                <rect width="60" height="42" fill="#009739" />
                <path d="M30 4 55 21 30 38 5 21Z" fill="#ffdf00" />
                <circle cx="30" cy="21" r="10.2" fill="#002776" />
                <path
                  d="M20 18.4c6.4-1.2 13.2-.6 19.7 1.8"
                  fill="none"
                  stroke="#fff"
                  strokeWidth="1.35"
                />
              </svg>
            </span>
            APOIO ESCOLAR · BNCC
          </span>
          <h1 id="school-title">
            Um caminho de estudo
            <br />
            <em>por ano e disciplina.</em>
          </h1>
          <p>
            Encontre habilidades da Base Nacional Comum Curricular e estude com pequenas etapas,
            exemplos e prática no seu ritmo.
          </p>
        </div>
        <div className="school-hero-mark" aria-hidden="true">
          <BookOpen size={48} strokeWidth={1.25} />
          <span>BNCC</span>
        </div>
      </section>

      <section className="school-browser" aria-labelledby="school-browser-title">
        <div className="school-section-heading">
          <div>
            <span className="school-kicker">SEU PERCURSO</span>
            <h2 id="school-browser-title">Por onde você quer começar?</h2>
          </div>
          <span className="school-pilot-tag">
            <Sparkles size={13} aria-hidden="true" /> Amostra inicial
          </span>
        </div>

        <div className="school-filters">
          <label>
            <span>Etapa</span>
            <select value={stageId} onChange={event => changeStage(event.target.value)}>
              {schoolStages.map(option => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span>Ano</span>
            <select value={currentYear} onChange={event => setYear(event.target.value)}>
              {currentStage.years.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span>{stageId === 'medio' ? 'Área do conhecimento' : 'Disciplina'}</span>
            <select value={currentSubject} onChange={event => setSubject(event.target.value)}>
              {currentStage.subjects.map(option => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
        </div>

        {skill ? (
          <article className="school-skill-card" aria-live="polite">
            <div className="school-skill-meta">
              <span>
                {skill.yearLabel ??
                  currentStage.years.find(option => option.value === currentYear)?.label}
              </span>
              <span>{currentSubject}</span>
              <code>{skill.code}</code>
            </div>
            <h3>{skill.title}</h3>
            <p className="school-skill-description">{skill.description}</p>
            <div className="school-goal">
              <Lightbulb size={17} aria-hidden="true" />
              <p>
                <b>O que você vai praticar</b>
                <span>{skill.goal}</span>
              </p>
            </div>
            <div className="school-steps">
              <h4>Vamos por partes</h4>
              <ol>
                {skill.studySteps.map((step, index) => (
                  <li key={step}>
                    <span>{index + 1}</span>
                    <p>{step}</p>
                  </li>
                ))}
              </ol>
            </div>
            <details className="school-practice">
              <summary>
                <span>Experimente responder</span>
                <ArrowRight size={16} aria-hidden="true" />
              </summary>
              <p>{skill.practicePrompt}</p>
              <details>
                <summary>Ver uma explicação</summary>
                <p>{skill.practiceAnswer}</p>
              </details>
            </details>
            <a className="school-source-link" href={sourceUrl} target="_blank" rel="noreferrer">
              Conferir habilidade na BNCC oficial <ExternalLink size={14} aria-hidden="true" />
            </a>
          </article>
        ) : (
          <div className="school-empty" aria-live="polite">
            <BookOpen size={22} aria-hidden="true" />
            <div>
              <h3>Este percurso está sendo preparado</h3>
              <p>
                A amostra cobre alguns recortes da BNCC. Escolha uma das demonstrações abaixo para
                ver como uma habilidade vira uma atividade de estudo.
              </p>
            </div>
          </div>
        )}
      </section>

      <section className="school-relations" aria-labelledby="school-relations-title">
        <div className="school-section-heading school-relations-heading">
          <div>
            <span className="school-kicker">COMO OS ASSUNTOS SE CONECTAM</span>
            <h2 id="school-relations-title">Explore as relações da BNCC</h2>
            <p>
              Veja a estrutura curricular, uma sequência possível e conexões entre os exemplos da
              amostra.
            </p>
          </div>
          <span className="school-pilot-tag">
            <GitBranch size={13} aria-hidden="true" /> 3 habilidades · 2 conexões sugeridas
          </span>
        </div>

        <div className="school-relation-tabs" role="group" aria-label="Visualização das relações">
          {relationshipViewOptions.map(option => {
            const Icon = option.icon;
            return (
              <button
                key={option.id}
                type="button"
                aria-pressed={relationshipView === option.id}
                onClick={() => setRelationshipView(option.id)}
              >
                <Icon size={16} aria-hidden="true" /> {option.label}
              </button>
            );
          })}
        </div>

        {relationshipView === 'sequence' && (
          <ol className="school-sequence-view" aria-label="Sequência de estudo sugerida">
            {pilotSkills.map((sample, index) => {
              const next = pilotSkills[index + 1];
              const relation = next ? relationByPair.get(`${sample.code}:${next.code}`) : undefined;
              return (
                <li className="school-sequence-step" key={sample.code}>
                  <div className="school-sequence-marker" aria-hidden="true">
                    {index + 1}
                  </div>
                  {renderSkillNode(sample)}
                  {relation && (
                    <div className="school-sequence-connection">
                      <span />
                      <p>
                        <b>{relation.label}</b>
                        {relation.explanation}
                      </p>
                    </div>
                  )}
                </li>
              );
            })}
          </ol>
        )}

        {relationshipView === 'tree' && (
          <div
            className="school-tree-view"
            role="group"
            aria-label="Árvore da estrutura curricular na amostra"
          >
            <div className="school-tree-root">Educação Básica · recortes da BNCC</div>
            <div className="school-tree-branches">
              {pilotSkills.map(sample => {
                const sampleStage = schoolStages.find(option => option.id === sample.stage);
                return (
                  <div className="school-tree-branch" key={sample.code}>
                    <div className="school-tree-path">
                      <span>{sampleStage?.label}</span>
                      <span>{sample.yearLabel ?? `${sample.year}º ano`}</span>
                      <span>{sample.subject}</span>
                    </div>
                    {renderSkillNode(sample)}
                  </div>
                );
              })}
            </div>
            <p className="school-relation-note">
              A árvore mostra os níveis cadastrados nesta amostra. Ela não representa todo o
              currículo nem todas as unidades temáticas e objetos de conhecimento da Base.
            </p>
          </div>
        )}

        {relationshipView === 'graph' && (
          <div className="school-graph-view">
            <div
              className="school-graph-scroll"
              role="region"
              tabIndex={0}
              aria-label="Grafo de conexões entre habilidades; deslize horizontalmente em telas estreitas"
            >
              <div className="school-graph-canvas">
                <svg viewBox="0 0 780 250" aria-hidden="true" focusable="false">
                  <path d="M230 64 C250 64 255 180 275 180" />
                  <path d="M505 180 C525 180 530 64 550 64" />
                </svg>
                <div className="school-graph-node school-graph-node-start">
                  {renderSkillNode(pilotSkills[0])}
                </div>
                <div className="school-graph-node school-graph-node-middle">
                  {renderSkillNode(pilotSkills[1])}
                </div>
                <div className="school-graph-node school-graph-node-end">
                  {renderSkillNode(pilotSkills[2])}
                </div>
              </div>
            </div>
            <div className="school-graph-relations">
              {pilotSkillRelations.map(relation => (
                <article key={`${relation.from}:${relation.to}`}>
                  <span>
                    {relation.from} <ArrowRight size={13} aria-hidden="true" /> {relation.to}
                  </span>
                  <b>{relation.label}</b>
                  <p>{relation.explanation}</p>
                </article>
              ))}
            </div>
          </div>
        )}

        <aside className="school-relation-note school-relation-note-global">
          <b>Como interpretar</b>
          <p>
            A árvore reflete a organização curricular da BNCC. A sequência e as conexões são
            sugestões editoriais para estudar: não indicam pré-requisitos oficiais nem uma ordem
            obrigatória. Selecione um cartão para abrir aquele percurso.
          </p>
        </aside>
      </section>

      <section className="school-samples" aria-labelledby="school-samples-title">
        <div className="school-section-heading">
          <div>
            <span className="school-kicker">TRÊS EXEMPLOS CURTOS</span>
            <h2 id="school-samples-title">Veja outros pontos de partida</h2>
          </div>
        </div>
        <div className="school-sample-grid">
          {pilotSkills.map(sample => {
            const sampleStage = schoolStages.find(option => option.id === sample.stage);
            const selected = skill?.code === sample.code;
            return (
              <button
                className={`school-sample-card ${selected ? 'is-selected' : ''}`}
                key={sample.code}
                type="button"
                aria-pressed={selected}
                onClick={() => applySample(sample)}
              >
                <span className="school-sample-code">{sample.code}</span>
                <span className="school-sample-title">{sample.title}</span>
                <span className="school-sample-description">
                  {sampleStage?.label}
                  {sample.yearLabel ? ` · ${sample.yearLabel}` : ''} · {sample.subject}
                </span>
                <span className="school-sample-action">
                  Abrir percurso <ArrowRight size={15} aria-hidden="true" />
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <aside className="school-disclaimer">
        <div>
          <b>Um apoio para estudar e revisar</b>
          <p>
            Esta amostra se orienta pela BNCC, mas ainda não cobre todas as habilidades nem os
            complementos de cada rede. Não oferece matrícula, certificação ou substitui a escola.
          </p>
        </div>
        <a href="https://downloadbncc.mec.gov.br/" target="_blank" rel="noreferrer">
          Consultar a Base completa <ExternalLink size={14} aria-hidden="true" />
        </a>
      </aside>
    </div>
  );
}
