import { Component, type ErrorInfo, type ReactNode } from 'react';

type Props = { children: ReactNode };
type State = { hasError: boolean };

/** Keeps an unexpected render failure from leaving the whole page blank. */
export class AppErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Keep diagnostics local to the browser; do not send reader data to a third party.
    if (import.meta.env.DEV)
      console.error('Calm & Study render error:', error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="app-error-fallback" role="alert" aria-labelledby="app-error-title">
          <span className="eyebrow">UM PEQUENO IMPREVISTO</span>
          <h1 id="app-error-title">Não conseguimos abrir esta parte agora.</h1>
          <p>
            Seu progresso salvo continua neste dispositivo. Tente carregar a Calm & Study novamente.
          </p>
          <button className="primary" type="button" onClick={() => window.location.reload()}>
            Tentar novamente
          </button>
        </main>
      );
    }
    return this.props.children;
  }
}
