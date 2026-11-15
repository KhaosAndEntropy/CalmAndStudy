import { useEffect } from 'react';
import { Palette, Type, X } from 'lucide-react';

export type AppearancePreferenceKey =
  'palette' | 'layout' | 'font' | 'fontSize' | 'readingProgress';

const palettes = [
  { id: 'sage', name: 'Sálvia', swatches: ['#f8f7f3', '#e5ecdf', '#4d6b53'] },
  { id: 'lavender', name: 'Lavanda', swatches: ['#f7f5f9', '#eae4f1', '#74638c'] },
  { id: 'ocean', name: 'Oceano', swatches: ['#f3f7f8', '#dcebed', '#46717a'] },
  { id: 'peach', name: 'Pêssego', swatches: ['#faf6f1', '#f2e3d5', '#9b6849'] },
  { id: 'night', name: 'Noite', swatches: ['#222823', '#343d35', '#adc49d'] },
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
  onChange: (key: AppearancePreferenceKey, value: string) => void;
  onClose: () => void;
};

export function AppearancePanel({
  palette,
  layout,
  font,
  fontSize,
  readingProgress,
  onChange,
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
      aria-label="Preferências de aparência"
    >
      <div className="appearance-head">
        <span>
          <Palette size={16} aria-hidden="true" /> Personalize seu espaço
        </span>
        <button className="icon-btn" onClick={onClose} aria-label="Fechar preferências">
          <X size={16} aria-hidden="true" />
        </button>
      </div>
      <div className="pref-group" role="group" aria-label="Paleta de cores">
        <div className="pref-label">Paleta de cores</div>
        <div className="palette-options">
          {palettes.map(item => (
            <button
              key={item.id}
              className={`palette-choice ${palette === item.id ? 'selected' : ''}`}
              onClick={() => onChange('palette', item.id)}
              aria-pressed={palette === item.id}
            >
              <span className="swatches" aria-hidden="true">
                {item.swatches.map((color, index) => (
                  <i key={color} className={`swatch-${item.id}-${index}`} />
                ))}
              </span>
              <small>{item.name}</small>
            </button>
          ))}
        </div>
      </div>
      <div className="pref-group" role="group" aria-label="Estilo de layout">
        <div className="pref-label">Estilo de layout</div>
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
      <div className="pref-group" role="group" aria-label="Tipografia">
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
    </section>
  );
}
