import { useState } from 'react';
import { Compass } from 'lucide-react';
import type { StudyPath } from '@calmandstudy/content';
import { applyImageTone } from '../shared/imageTone';

export function TrailArtwork({ path }: { path: StudyPath }) {
  const [imageFailed, setImageFailed] = useState(false);
  if (imageFailed)
    return (
      <span
        className="trail-art trail-art-fallback"
        role="img"
        aria-label={`Ilustração de reserva para a trilha ${path.title}`}
      >
        <Compass size={34} aria-hidden="true" />
      </span>
    );
  return (
    <span className="trail-art">
      <img
        src={`/images/trails/${path.id}.jpg`}
        alt={`Imagem gerada por IA para ilustrar a trilha: ${path.title}. Não representa evidência científica ou histórica.`}
        loading="lazy"
        onLoad={event => applyImageTone(event.currentTarget)}
        onError={() => setImageFailed(true)}
      />
    </span>
  );
}
