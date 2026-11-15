import { useCallback, useEffect, useRef, useState } from 'react';
import type { AmbientMode } from './AppearancePanel';

type AmbientEngine = {
  context: AudioContext;
  gain: GainNode;
  source: AudioBufferSourceNode;
};

function createAmbientEngine(mode: Exclude<AmbientMode, 'off'>, volume: number): AmbientEngine {
  const AudioContextConstructor = window.AudioContext;
  if (!AudioContextConstructor) throw new Error('Áudio não disponível neste navegador.');

  const context = new AudioContextConstructor();
  const length = context.sampleRate * 3;
  const buffer = context.createBuffer(1, length, context.sampleRate);
  const data = buffer.getChannelData(0);
  let brownNoise = 0;
  for (let index = 0; index < length; index += 1) {
    const whiteNoise = Math.random() * 2 - 1;
    brownNoise = (brownNoise + 0.035 * whiteNoise) / 1.035;
    data[index] = mode === 'rain' ? whiteNoise * 0.7 + brownNoise * 2.2 : brownNoise * 3.2;
  }

  const source = context.createBufferSource();
  const highPass = context.createBiquadFilter();
  const lowPass = context.createBiquadFilter();
  const gain = context.createGain();
  source.buffer = buffer;
  source.loop = true;
  highPass.type = 'highpass';
  highPass.frequency.value = mode === 'rain' ? 480 : 45;
  lowPass.type = 'lowpass';
  lowPass.frequency.value = mode === 'rain' ? 4200 : 520;
  gain.gain.value = volume * 0.12;
  source.connect(highPass);
  highPass.connect(lowPass);
  lowPass.connect(gain);
  gain.connect(context.destination);
  source.start();
  void context.resume();
  return { context, gain, source };
}

export function useAmbientSoundscape() {
  const engine = useRef<AmbientEngine | null>(null);
  const [mode, setModeState] = useState<AmbientMode>('off');
  const [volume, setVolumeState] = useState(0.18);
  const [available, setAvailable] = useState(
    () => typeof window !== 'undefined' && Boolean(window.AudioContext),
  );

  const stop = useCallback(() => {
    if (engine.current) {
      try {
        engine.current.source.stop();
      } catch {
        // A fonte pode já estar parada durante uma troca rápida de ambiente.
      }
      if (engine.current.context.state !== 'closed') void engine.current.context.close();
      engine.current = null;
    }
    setModeState('off');
  }, []);

  const setMode = useCallback(
    (nextMode: AmbientMode) => {
      if (nextMode === 'off') {
        stop();
        return;
      }
      stop();
      try {
        engine.current = createAmbientEngine(nextMode, volume);
        setAvailable(true);
        setModeState(nextMode);
      } catch {
        setAvailable(false);
        setModeState('off');
      }
    },
    [stop, volume],
  );

  const setVolume = useCallback((nextVolume: number) => {
    const safeVolume = Math.min(0.3, Math.max(0.04, nextVolume));
    setVolumeState(safeVolume);
    const current = engine.current;
    if (current) {
      current.gain.gain.setTargetAtTime(safeVolume * 0.12, current.context.currentTime, 0.08);
    }
  }, []);

  useEffect(() => {
    const manageVisibility = () => {
      const context = engine.current?.context;
      if (!context) return;
      if (document.hidden) void context.suspend();
      else if (mode !== 'off') void context.resume();
    };
    document.addEventListener('visibilitychange', manageVisibility);
    return () => document.removeEventListener('visibilitychange', manageVisibility);
  }, [mode]);

  useEffect(
    () => () => {
      if (engine.current) {
        try {
          engine.current.source.stop();
        } catch {
          // O contexto pode ter sido encerrado pelo navegador.
        }
        if (engine.current.context.state !== 'closed') void engine.current.context.close();
        engine.current = null;
      }
    },
    [],
  );

  return { mode, volume, available, setMode, setVolume };
}
