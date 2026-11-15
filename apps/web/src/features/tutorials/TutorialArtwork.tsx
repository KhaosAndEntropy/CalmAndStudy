import { useEffect, useState } from 'react';
import { GraduationCap } from 'lucide-react';
import type { Tutorial } from '@calmandstudy/content';
import { applyImageTone } from '../shared/imageTone';

export function TutorialArtwork({ tutorial, index }: { tutorial: Tutorial; index: number }) {
  const [imageFailed, setImageFailed] = useState(false);
  useEffect(() => setImageFailed(false), [tutorial.id]);

  return (
    <div className={`tutorial-art tutorial-art-${index % 3}`}>
      {!imageFailed ? (
        <img
          className="tutorial-generated-image"
          src={`/images/tutorials/${tutorial.id}.jpg`}
          alt={`Imagem ilustrativa gerada por IA para o tutorial: ${tutorial.title}.`}
          loading="lazy"
          decoding="async"
          onLoad={event => applyImageTone(event.currentTarget)}
          onError={() => setImageFailed(true)}
        />
      ) : (
        <span
          className="tutorial-art-fallback"
          role="img"
          aria-label={`Ilustração de reserva para o tutorial ${tutorial.title}`}
        >
          <GraduationCap size={27} aria-hidden="true" />
        </span>
      )}
      <small className="tutorial-duration">{tutorial.durationMinutes} MIN</small>
    </div>
  );
}
