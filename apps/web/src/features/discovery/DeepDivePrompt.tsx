import { ArrowRight, Sparkles } from 'lucide-react';

/** A single-purpose call to action connecting discovery with guided study paths. */
export function DeepDivePrompt({ onExplore }: { onExplore: () => void }) {
  return (
    <aside className="deep-dive" aria-label="Explorar trilhas de estudo">
      <span className="deep-icon" aria-hidden="true">
        <Sparkles size={20} />
      </span>
      <div className="deep-dive-copy">
        <span className="eyebrow muted">APRENDA NO SEU RITMO</span>
        <h3>Quer se aprofundar em um tema?</h3>
        <p>Escolha uma área e monte uma trilha clara, do começo ao próximo nível.</p>
      </div>
      <button className="outline-btn" onClick={onExplore}>
        Explorar trilhas <ArrowRight size={15} />
      </button>
    </aside>
  );
}
