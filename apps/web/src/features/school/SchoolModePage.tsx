import { useMemo, useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  ExternalLink,
  GraduationCap,
  Lightbulb,
  Sparkles,
} from 'lucide-react';
import {
  bnccHighSchoolSourceUrl,
  bnccSourceUrl,
  pilotSkills,
  schoolStages,
  type SchoolStageId,
} from './school-curriculum';
import './school-mode.css';

export function SchoolModePage() {
  const [stageId, setStageId] = useState<SchoolStageId>('fundamental-inicial');
  const [year, setYear] = useState(schoolStages[0].years[0]?.value ?? '1');
  const [subject, setSubject] = useState('Matemática');
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
