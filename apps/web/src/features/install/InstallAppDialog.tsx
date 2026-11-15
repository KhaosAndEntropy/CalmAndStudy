import { Download, ExternalLink, Smartphone, X } from 'lucide-react';

type InstallAppDialogProps = {
  canInstall: boolean;
  isInstalled: boolean;
  onInstall: () => void;
  onClose: () => void;
};

export function InstallAppDialog({
  canInstall,
  isInstalled,
  onInstall,
  onClose,
}: InstallAppDialogProps) {
  return (
    <div
      className="overlay install-overlay"
      onMouseDown={event => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        className="install-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="install-dialog-title"
        aria-describedby="install-dialog-description"
      >
        <button
          className="install-dialog-close icon-btn"
          onClick={onClose}
          aria-label="Fechar instruções de instalação"
        >
          <X size={19} aria-hidden="true" />
        </button>
        <div className="install-dialog-mark">
          <Smartphone size={20} aria-hidden="true" />
        </div>
        <div className="eyebrow">LEVE A CALM & STUDY COM VOCÊ</div>
        <h2 id="install-dialog-title">Instale a Calm & Study no seu dispositivo.</h2>
        <p id="install-dialog-description">
          A versão web pode ser adicionada à tela inicial ou instalada pelo navegador. Ela abre em
          uma janela própria, como um aplicativo, sem passar por uma loja.
        </p>
        {isInstalled ? (
          <p className="install-status" role="status">
            A Calm & Study já está instalada neste dispositivo.
          </p>
        ) : (
          canInstall && (
            <button className="primary install-native-button" onClick={onInstall}>
              <Download size={16} aria-hidden="true" /> Instalar Calm & Study
            </button>
          )
        )}
        <div className="install-options">
          <section>
            <b>Android</b>
            <p>
              No Chrome ou Edge, toque no menu <strong>⋮</strong> e escolha{' '}
              <strong>Instalar app</strong> ou <strong>Adicionar à tela inicial</strong>.
            </p>
          </section>
          <section>
            <b>iPhone ou iPad</b>
            <p>
              No Safari, toque em <strong>Compartilhar</strong> e escolha{' '}
              <strong>Adicionar à Tela de Início</strong>.
            </p>
          </section>
          <section>
            <b>Computador</b>
            <p>
              No Chrome ou Edge, procure o ícone de instalação na barra de endereço ou a opção de
              instalar no menu do navegador.
            </p>
          </section>
        </div>
        <p className="install-dialog-note">
          <ExternalLink size={13} aria-hidden="true" /> A opção pode variar conforme o navegador. A
          Calm & Study continua disponível pelo site mesmo sem instalação.
        </p>
      </section>
    </div>
  );
}
