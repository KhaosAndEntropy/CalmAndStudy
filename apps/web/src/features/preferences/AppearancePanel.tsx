import { useEffect } from 'react';
import { Headphones, Palette, Type, Volume2, X } from 'lucide-react';

export type AppearancePreferenceKey =
  'palette' | 'layout' | 'font' | 'fontSize' | 'readingProgress';
export type AmbientMode = 'off' | 'rain' | 'focus';

export const appearancePalettes = [
  {
    id: 'sage',
    name: 'Sálvia',
    description: 'natural e equilibrada',
    swatches: ['#f8f7f3', '#e5ecdf', '#4d6b53'],
  },
  {
    id: 'lavender',
    name: 'Lavanda',
    description: 'suave e contemplativa',
    swatches: ['#f7f5f9', '#eae4f1', '#74638c'],
  },
  {
    id: 'ocean',
    name: 'Oceano',
    description: 'fresca e serena',
    swatches: ['#f3f7f8', '#dcebed', '#46717a'],
  },
  {
    id: 'peach',
    name: 'Pêssego',
    description: 'quente e acolhedora',
    swatches: ['#faf6f1', '#f2e3d5', '#9b6849'],
  },
  {
    id: 'paper',
    name: 'Papel',
    description: 'quente como uma página impressa',
    swatches: ['#f4efe4', '#eee5d3', '#765d3d'],
  },
  {
    id: 'night',
    name: 'Noite',
    description: 'mais confortável em baixa luz',
    swatches: ['#222823', '#343d35', '#adc49d'],
  },
  {
    id: 'contrast',
    name: 'Alto contraste',
    description: 'texto e fundo bem separados',
    swatches: ['#ffffff', '#e6e6e6', '#111111'],
  },
] as const;

const paletteGroups = [
  { title: 'Acolhedoras', ids: ['sage', 'lavender', 'ocean', 'peach', 'paper'] },
  { title: 'Baixa luz e contraste', ids: ['night', 'contrast'] },
];

const layouts = [
  { id: 'comfortable', name: 'Confortável', description: 'Equilibrado' },
  { id: 'compact', name: 'Compacto', description: 'Mais assuntos' },
  { id: 'visual', name: 'Visual', description: 'Imagens em destaque' },
];

type AppearancePanelProps = {
  palette: string;
  layout: string;
  font: string;
  fontSize: string;
  readingProgress?: boolean;
  ambientMode?: AmbientMode;
  ambientVolume?: number;
  ambientAvailable?: boolean;
  onChange: (key: AppearancePreferenceKey, value: string) => void;
  onAmbientModeChange?: (value: AmbientMode) => void;
  onAmbientVolumeChange?: (value: number) => void;
  onClose: () => void;
};

export function AppearancePanel({
  palette,
  layout,
  font,
  fontSize,
  readingProgress,
  ambientMode = 'off',
  ambientVolume = 0.18,
  ambientAvailable = true,
  onChange,
  onAmbientModeChange,
  onAmbientVolumeChange,
  onClose,
}: AppearancePanelProps) {
  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
        document.querySelector<HTMLButtonElement>('.appearance-trigger')?.focus();
      }
    };
    document.addEventListener('keydown', closeOnEscape);
    return () => document.removeEventListener('keydown', closeOnEscape);
  }, [onClose]);

  return (
    <section
      id="appearance-panel"
      className="appearance-panel"
      aria-label="Acessibilidade e conforto de leitura"
    >
      <div className="appearance-head">
        <span>
          <Palette size={16} aria-hidden="true" /> Acessibilidade e conforto
        </span>
        <button className="icon-btn" onClick={onClose} aria-label="Fechar preferências">
          <X size={16} aria-hidden="true" />
        </button>
      </div>

      <div className="pref-group" role="group" aria-label="Temas visuais para conforto">
        <div className="pref-label">Temas visuais</div>
        <p className="pref-help">
          Escolha a combinação que deixa a leitura mais confortável para você.
        </p>
        {paletteGroups.map(group => (
          <div className="palette-category" key={group.title}>
            <h3>{group.title}</h3>
            <div className="palette-options">
              {appearancePalettes
                .filter(item => group.ids.includes(item.id))
                .map(item => (
                  <button
                    key={item.id}
                    className={`palette-choice ${palette === item.id ? 'selected' : ''}`}
                    onClick={() => onChange('palette', item.id)}
                    aria-pressed={palette === item.id}
                    aria-label={`${item.name}: ${item.description}`}
                  >
                    <span className="swatches" aria-hidden="true">
                      {item.swatches.map((color, index) => (
                        <i key={`${item.id}-${index}`} style={{ backgroundColor: color }} />
                      ))}
                    </span>
                    <small>{item.name}</small>
                  </button>
                ))}
            </div>
          </div>
        ))}
      </div>

      <div className="pref-group" role="group" aria-label="Organização visual">
        <div className="pref-label">Organização visual</div>
        <div className="layout-options">
          {layouts.map((item, index) => (
            <button
              key={item.id}
              className={`layout-choice ${layout === item.id ? 'selected' : ''}`}
              onClick={() => onChange('layout', item.id)}
              aria-pressed={layout === item.id}
            >
              <span className={`layout-preview preview-${index}`} aria-hidden="true">
                <i />
                <i />
                <i />
              </span>
              <b>{item.name}</b>
              <small>{item.description}</small>
            </button>
          ))}
        </div>
      </div>

      <div className="pref-group" role="group" aria-label="Leitura e tipografia">
        <div className="pref-label">
          <Type size={14} aria-hidden="true" /> Tipografia
        </div>
        <div className="type-options">
          {[
            ['sans', 'Sem serifa'],
            ['serif', 'Serifada'],
            ['rounded', 'Suave'],
          ].map(([id, label]) => (
            <button
              key={id}
              className={font === id ? 'selected' : ''}
              onClick={() => onChange('font', id)}
              aria-pressed={font === id}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="pref-group size-group" role="group" aria-label="Tamanho do texto">
        <div className="pref-label">
          Tamanho do texto{' '}
          <span>
            {fontSize === 'small' ? 'Pequeno' : fontSize === 'large' ? 'Grande' : 'Padrão'}
          </span>
        </div>
        <div className="size-options">
          {[
            ['small', 'Pequeno'],
            ['normal', 'Padrão'],
            ['large', 'Grande'],
          ].map(([id, label]) => (
            <button
              key={id}
              className={fontSize === id ? 'selected' : ''}
              onClick={() => onChange('fontSize', id)}
              aria-label={`Tamanho do texto: ${label}`}
              aria-pressed={fontSize === id}
            >
              {id === 'small' ? 'A−' : id === 'large' ? 'A+' : 'A'}
            </button>
          ))}
        </div>
      </div>

      <label className="reading-progress-option">
        <input
          type="checkbox"
          checked={readingProgress ?? false}
          onChange={event => onChange('readingProgress', String(event.target.checked))}
        />
        <span>
          <b>Progresso de leitura</b>
          <small>Mostrar quanto falta no artigo</small>
        </span>
      </label>

      <div className="pref-group" role="group" aria-label="Ambiente sonoro opcional">
        <div className="pref-label">
          <Headphones size={14} aria-hidden="true" /> Ambiente sonoro · opcional
        </div>
        <p className="pref-help">
          Começa desligado. O som é criado no seu aparelho e para quando você desliga.
        </p>
        <p className="pref-help sound-study-guidance">
          Não existe um som ideal para todo mundo. Para leitura exigente, experimente primeiro o
          silêncio; se preferir música, teste uma faixa instrumental suave e em volume baixo. Você
          também pode usar sua própria música em outro aplicativo — a Sala não reproduz faixas
          protegidas por direitos autorais.
        </p>
        <details className="sound-evidence">
          <summary>O que as pesquisas indicam?</summary>
          <p>
            Os resultados variam conforme a pessoa e a tarefa. Em um estudo, músicas com letras
            atrapalharam tarefas de memória e compreensão de leitura; a música instrumental testada
            não mostrou benefício ou prejuízo claro.
          </p>
          <a
            href="https://pmc.ncbi.nlm.nih.gov/articles/PMC10162369/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Consultar o estudo sobre música de fundo e tarefas cognitivas
          </a>
          <a
            href="https://pmc.ncbi.nlm.nih.gov/articles/PMC9886987/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Consultar o estudo sobre música escolhida pela pessoa durante a leitura
          </a>
        </details>
        <div className="ambient-options">
          <button
            type="button"
            aria-pressed={ambientMode === 'off'}
            onClick={() => onAmbientModeChange?.('off')}
          >
            Silêncio
          </button>
          <button
            type="button"
            aria-pressed={ambientMode === 'rain'}
            onClick={() => onAmbientModeChange?.(ambientMode === 'rain' ? 'off' : 'rain')}
          >
            <Volume2 size={14} aria-hidden="true" /> Chuva suave
          </button>
          <button
            type="button"
            aria-pressed={ambientMode === 'focus'}
            onClick={() => onAmbientModeChange?.(ambientMode === 'focus' ? 'off' : 'focus')}
          >
            <Volume2 size={14} aria-hidden="true" /> Ruído de foco
          </button>
        </div>
        {ambientMode !== 'off' && (
          <label className="ambient-volume">
            <span>Volume baixo</span>
            <input
              type="range"
              min="0.04"
              max="0.3"
              step="0.01"
              value={ambientVolume}
              aria-label="Volume do ambiente sonoro"
              onChange={event => onAmbientVolumeChange?.(Number(event.target.value))}
            />
          </label>
        )}
        {!ambientAvailable && (
          <p className="pref-help" role="status">
            Este navegador não oferece áudio ambiente. O restante do site continua funcionando
            normalmente.
          </p>
        )}
      </div>
    </section>
  );
}
