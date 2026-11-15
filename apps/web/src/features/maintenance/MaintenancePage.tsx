import { Sparkles } from 'lucide-react';

export function MaintenancePage() {
  return (
    <main className="maintenance-page">
      <section className="maintenance-card" aria-labelledby="maintenance-title">
        <a className="maintenance-brand" href="/" aria-label="Calm & Study — início">
          <span className="maintenance-brand-mark" aria-hidden="true">
            <Sparkles size={20} />
          </span>
          <span>
            Calm & Study<span>.</span>
          </span>
        </a>

        <div className="maintenance-art" aria-hidden="true">
          <span className="maintenance-orbit maintenance-orbit-one" />
          <span className="maintenance-orbit maintenance-orbit-two" />
          <span className="maintenance-sun" />
          <Sparkles className="maintenance-sparkle" size={22} />
        </div>

        <p className="eyebrow">UMA PAUSA PARA PREPARAR O PRÓXIMO CAPÍTULO</p>
        <h1 id="maintenance-title">
          Estamos preparando
          <br />
          <em>uma nova Calm & Study.</em>
        </h1>
        <p className="maintenance-copy">
          O site está temporariamente em manutenção. Estamos organizando algumas melhorias para
          voltar com uma experiência ainda melhor.
        </p>
        <p className="maintenance-signoff">Até breve — e obrigado por sua curiosidade.</p>
      </section>
      <footer className="maintenance-footer">
        Calm & Study · conhecimento para explorar no seu ritmo
      </footer>
    </main>
  );
}
