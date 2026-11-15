import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  MousePointer2,
  Pause,
  Play,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react';

export type WelcomeTourStop = {
  section: string;
  title: string;
  description: string;
  target: string;
  targetMobile?: string;
  action?:
    | 'article'
    | 'articleQuiz'
    | 'tutorial'
    | 'tutorialQuiz'
    | 'appearance'
    | 'suggestion'
    | 'install';
};

type TargetRect = { top: number; left: number; width: number; height: number };
type PopoverPosition = {
  top: number;
  left: number;
  placement: 'above' | 'below' | 'left' | 'right' | 'dock';
};

export function WelcomeTour({
  stop,
  index,
  total,
  onBack,
  onNext,
  onClose,
}: {
  stop: WelcomeTourStop;
  index: number;
  total: number;
  onBack: () => void;
  onNext: () => void;
  onClose: () => void;
}) {
  const [targetRect, setTargetRect] = useState<TargetRect | null>(null);
  const [popover, setPopover] = useState<PopoverPosition>({
    top: 24,
    left: 24,
    placement: 'below',
  });
  const [popoverPlaced, setPopoverPlaced] = useState(false);
  const popoverRef = useRef<HTMLElement>(null);
  const [playing, setPlaying] = useState(
    () => !window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );
  const [audioSupported] = useState(
    () => 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window,
  );
  const [audioEnabled, setAudioEnabled] = useState(audioSupported);
  const onNextRef = useRef(onNext);
  onNextRef.current = onNext;
  const last = index === total - 1;

  useEffect(() => {
    let cancelled = false;
    let frame = 0;
    let timer = 0;
    setPopoverPlaced(false);
    setTargetRect(null);
    const locate = () => {
      const mobile = window.matchMedia('(max-width: 720px)').matches;
      const selector = mobile ? (stop.targetMobile ?? stop.target) : stop.target;
      const candidates = [...document.querySelectorAll<HTMLElement>(selector)];
      const target =
        candidates.find(element => {
          const rect = element.getBoundingClientRect();
          const style = window.getComputedStyle(element);
          return (
            element.getClientRects().length > 0 &&
            style.visibility !== 'hidden' &&
            style.display !== 'none' &&
            rect.width > 0 &&
            rect.height > 0
          );
        }) ?? document.querySelector<HTMLElement>('.topbar');
      if (!target) return;
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      target.scrollIntoView({
        behavior: reducedMotion ? 'instant' : 'smooth',
        block: 'center',
        inline: 'nearest',
      });
      timer = window.setTimeout(
        () => {
          if (cancelled) return;
          const rect = target.getBoundingClientRect();
          const pad = 8;
          const width = Math.min(window.innerWidth - pad * 2, rect.width + pad * 2);
          const height = Math.min(window.innerHeight - pad * 2, rect.height + pad * 2);
          const focused = {
            top: Math.min(window.innerHeight - height - pad, Math.max(pad, rect.top - pad)),
            left: Math.min(window.innerWidth - width - pad, Math.max(pad, rect.left - pad)),
            width,
            height,
          };
          setTargetRect(focused);
          setPopoverPlaced(false);
        },
        reducedMotion ? 0 : 420,
      );
    };
    frame = window.requestAnimationFrame(() => window.requestAnimationFrame(locate));
    return () => {
      cancelled = true;
      window.cancelAnimationFrame(frame);
      window.clearTimeout(timer);
    };
  }, [stop.target, stop.targetMobile]);

  useLayoutEffect(() => {
    const element = popoverRef.current;
    if (!targetRect || !element) return;

    const margin = 12;
    const gap = 16;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const { width, height } = element.getBoundingClientRect();
    const centerLeft = targetRect.left + targetRect.width / 2 - width / 2;
    const centerTop = targetRect.top + targetRect.height / 2 - height / 2;
    const candidates: Array<PopoverPosition & { placement: PopoverPosition['placement'] }> = [
      { top: targetRect.top - height - gap, left: centerLeft, placement: 'above' },
      { top: targetRect.top + targetRect.height + gap, left: centerLeft, placement: 'below' },
      { top: centerTop, left: targetRect.left - width - gap, placement: 'left' },
      { top: centerTop, left: targetRect.left + targetRect.width + gap, placement: 'right' },
    ];
    const fits = (candidate: PopoverPosition) => {
      const inViewport =
        candidate.left >= margin &&
        candidate.top >= margin &&
        candidate.left + width <= viewportWidth - margin &&
        candidate.top + height <= viewportHeight - margin;
      const overlaps =
        candidate.left < targetRect.left + targetRect.width &&
        candidate.left + width > targetRect.left &&
        candidate.top < targetRect.top + targetRect.height &&
        candidate.top + height > targetRect.top;
      return inViewport && !overlaps;
    };
    const chosen = candidates.find(fits);

    if (chosen) {
      setPopover(chosen);
    } else {
      // Em alvos grandes, encaixa o balão no canto que cobre a menor área do destaque.
      const corners: PopoverPosition[] = [
        { top: margin, left: margin, placement: 'dock' },
        { top: margin, left: viewportWidth - width - margin, placement: 'dock' },
        { top: viewportHeight - height - margin, left: margin, placement: 'dock' },
        {
          top: viewportHeight - height - margin,
          left: viewportWidth - width - margin,
          placement: 'dock',
        },
      ];
      const intersectionArea = (candidate: PopoverPosition) => {
        const intersectionWidth = Math.max(
          0,
          Math.min(candidate.left + width, targetRect.left + targetRect.width) -
            Math.max(candidate.left, targetRect.left),
        );
        const intersectionHeight = Math.max(
          0,
          Math.min(candidate.top + height, targetRect.top + targetRect.height) -
            Math.max(candidate.top, targetRect.top),
        );
        return intersectionWidth * intersectionHeight;
      };
      setPopover(corners.sort((a, b) => intersectionArea(a) - intersectionArea(b))[0]);
    }
    setPopoverPlaced(true);
  }, [index, targetRect]);

  useEffect(() => {
    if (audioSupported) window.speechSynthesis.cancel();
    if (!playing) return;
    if (audioEnabled && audioSupported) {
      let cancelled = false;
      const utterance = new SpeechSynthesisUtterance(
        `${stop.section}. ${stop.title}. ${stop.description}`,
      );
      utterance.lang = 'pt-BR';
      const voices = window.speechSynthesis.getVoices();
      const portugueseVoice =
        voices.find(voice => voice.lang.toLowerCase() === 'pt-br') ??
        voices.find(voice => voice.lang.toLowerCase().startsWith('pt'));
      if (portugueseVoice) utterance.voice = portugueseVoice;
      utterance.rate = 0.96;
      utterance.onend = () => {
        if (!cancelled) onNextRef.current();
      };
      utterance.onerror = event => {
        if (!cancelled && event.error !== 'canceled' && event.error !== 'interrupted')
          setAudioEnabled(false);
      };
      window.speechSynthesis.speak(utterance);
      return () => {
        cancelled = true;
        window.speechSynthesis.cancel();
      };
    }
    const timer = window.setTimeout(() => onNextRef.current(), 10000);
    return () => window.clearTimeout(timer);
  }, [audioEnabled, audioSupported, index, playing, stop.description, stop.section, stop.title]);

  return (
    <div className="overlay tour-overlay" data-placement={popover.placement}>
      <div className="tour-guide-overlay" aria-hidden="true">
        {targetRect && <div className="tour-focus-hole" style={targetRect} />}
        {targetRect && (
          <MousePointer2
            className="tour-guide-cursor"
            size={29}
            fill="var(--v2-paper)"
            aria-hidden="true"
            style={{
              left: Math.min(window.innerWidth - 30, targetRect.left + targetRect.width * 0.76),
              top: Math.min(window.innerHeight - 32, targetRect.top + targetRect.height * 0.62),
            }}
          />
        )}
      </div>
      <section
        ref={popoverRef}
        className="tour-popover"
        style={{
          top: popover.top,
          left: popover.left,
          visibility: popoverPlaced ? 'visible' : 'hidden',
        }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="welcome-tour-title"
        aria-describedby="welcome-tour-description"
      >
        <button
          className="welcome-dialog-close icon-btn"
          onClick={onClose}
          aria-label="Encerrar tour"
        >
          <X size={17} aria-hidden="true" />
        </button>
        <div className="tour-popover-meta">
          <span>{stop.section}</span>
          <span aria-label={`Etapa ${index + 1} de ${total}`}>
            {String(index + 1).padStart(2, '0')} / {total}
          </span>
        </div>
        <h2 id="welcome-tour-title" aria-live="polite">
          {stop.title}
        </h2>
        <p id="welcome-tour-description">{stop.description}</p>
        <div className="welcome-tour-actions">
          <button
            className="outline-btn"
            onClick={onBack}
            disabled={index === 0}
            aria-label="Etapa anterior"
          >
            <ArrowLeft size={15} aria-hidden="true" />
          </button>
          <div className="tour-controls">
            <button
              className="tour-audio"
              onClick={() => setAudioEnabled(value => !value)}
              aria-pressed={audioEnabled}
              disabled={!audioSupported}
              title={
                audioSupported
                  ? audioEnabled
                    ? 'Desativar narração'
                    : 'Ativar narração'
                  : 'Áudio não disponível neste navegador'
              }
            >
              {audioEnabled ? (
                <Volume2 size={16} aria-hidden="true" />
              ) : (
                <VolumeX size={16} aria-hidden="true" />
              )}
              <span>{audioSupported ? (audioEnabled ? 'Voz ligada' : 'Ouvir') : 'Sem áudio'}</span>
            </button>
            <button
              className="tour-playback"
              onClick={() => setPlaying(value => !value)}
              aria-pressed={playing}
            >
              {playing ? (
                <Pause size={15} aria-hidden="true" />
              ) : (
                <Play size={15} aria-hidden="true" />
              )}
              <span>{playing ? 'Pausar' : 'Continuar'}</span>
            </button>
          </div>
          <button className="primary tour-next" onClick={onNext}>
            {last ? 'Concluir' : 'Próximo'} <ArrowRight size={15} aria-hidden="true" />
          </button>
        </div>
        <div
          className="tour-progress"
          role="progressbar"
          aria-label="Progresso do passeio"
          aria-valuemin={1}
          aria-valuemax={total}
          aria-valuenow={index + 1}
        >
          <span style={{ width: `${((index + 1) / total) * 100}%` }} />
        </div>
      </section>
    </div>
  );
}
