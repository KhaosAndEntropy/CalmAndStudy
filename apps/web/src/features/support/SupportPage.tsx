import { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { Check, Copy, HeartHandshake, ShieldCheck } from 'lucide-react';
import { buildPixCode } from './pixCode';
import './support-page.css';

const pixKey = import.meta.env.VITE_DONATION_PIX_KEY?.trim() ?? '';
const pixName = import.meta.env.VITE_DONATION_PIX_NAME?.trim() ?? '';
const pixCity = import.meta.env.VITE_DONATION_PIX_CITY?.trim() ?? '';

export function SupportPage() {
  const [pixImage, setPixImage] = useState('');
  const [pixPayload, setPixPayload] = useState('');
  const [pixError, setPixError] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setPixImage('');
    setPixPayload('');
    setPixError('');

    if (!pixKey || !pixName || !pixCity) return;

    try {
      const payload = buildPixCode(pixKey, pixName, pixCity);
      setPixPayload(payload);
      void QRCode.toDataURL(payload, {
        errorCorrectionLevel: 'M',
        margin: 2,
        width: 256,
        color: { dark: '#24342c', light: '#ffffff' },
      })
        .then(image => {
          if (!cancelled) setPixImage(image);
        })
        .catch(() => {
          if (!cancelled) setPixError('Não foi possível gerar o QR Pix. Confira a configuração.');
        });
    } catch (error) {
      setPixError(error instanceof Error ? error.message : 'Confira os dados do Pix configurados.');
    }

    return () => {
      cancelled = true;
    };
  }, []);

  const copyPixCode = async () => {
    try {
      await navigator.clipboard.writeText(pixPayload);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      setPixError(
        'Não foi possível copiar automaticamente. Leia o QR com o aplicativo do seu banco.',
      );
    }
  };

  return (
    <main className="support-page">
      <header className="support-hero">
        <span className="support-mark" aria-hidden="true">
          <HeartHandshake size={21} />
        </span>
        <div className="eyebrow">APOIO VOLUNTÁRIO · SEM PRESSA</div>
        <h1>
          Se quiser, ajude a sala <em>a continuar.</em>
        </h1>
        <p>
          A Sala de Calma e Estudo é gratuita e aberta. Se ela foi útil para você e fizer sentido,
          pode contribuir voluntariamente via Pix. Seguir estudando sem contribuir é igualmente
          bem-vindo.
        </p>
      </header>

      <section className="support-content" aria-labelledby="support-pix-title">
        <div className="support-copy">
          <span className="support-section-icon" aria-hidden="true">
            <ShieldCheck size={20} />
          </span>
          <div>
            <span className="eyebrow">CONTRIBUIÇÃO DIRETA</span>
            <h2 id="support-pix-title">Pix, se você desejar</h2>
            <p>
              O QR é montado no seu navegador com os dados configurados para este projeto. Não
              usamos um serviço externo para gerar a imagem. Confira o nome do destinatário e
              escolha o valor no aplicativo do seu banco antes de confirmar.
            </p>
          </div>
        </div>

        {pixImage ? (
          <div className="support-payment">
            <img
              src={pixImage}
              width="256"
              height="256"
              alt="QR Code Pix para contribuição voluntária"
            />
            <strong>
              {pixName} · {pixCity}
            </strong>
            <button type="button" className="support-copy-button" onClick={copyPixCode}>
              {copied ? (
                <Check size={17} aria-hidden="true" />
              ) : (
                <Copy size={17} aria-hidden="true" />
              )}
              {copied ? 'Pix copia e cola copiado' : 'Copiar Pix copia e cola'}
            </button>
            {pixError && (
              <p className="support-copy-feedback" role="status" aria-live="polite">
                {pixError}
              </p>
            )}
            <p>O QR não define valor. A contribuição é opcional e não libera recursos especiais.</p>
          </div>
        ) : (
          <p className="support-config-note" role={pixError ? 'alert' : 'status'}>
            {pixError ||
              'A opção Pix será exibida quando a chave e os dados do recebedor estiverem configurados.'}
          </p>
        )}
      </section>

      <section className="support-principles" aria-label="Compromissos do apoio">
        <article>
          <span>01</span>
          <h2>Sem cobrança ou recompensa</h2>
          <p>Não há assinatura, meta, vantagem ou pressão para contribuir.</p>
        </article>
        <article>
          <span>02</span>
          <h2>Conteúdo segue gratuito</h2>
          <p>O apoio não muda o acesso, os artigos, as fontes ou os critérios editoriais.</p>
        </article>
        <article>
          <span>03</span>
          <h2>Transparência</h2>
          <p>
            O Pix é destinado ao responsável pelo projeto; não é pagamento a uma instituição
            beneficente.
          </p>
        </article>
      </section>
      <p className="support-disclaimer">
        Apoio voluntário. Não é investimento nem compra de produto. Contribua somente se desejar e
        puder; não há benefício fiscal prometido.
      </p>
    </main>
  );
}

export default SupportPage;
