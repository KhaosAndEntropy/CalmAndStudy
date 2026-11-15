const CARD_SELECTOR = '.topic-card, .library-card, .trail-card, .tutorial-card, .reader';

/** Samples local artwork and stores a soft accent on its containing content card. */
export function applyImageTone(image: HTMLImageElement, target?: HTMLElement | null) {
  const card = target ?? image.closest<HTMLElement>(CARD_SELECTOR);
  if (!card || !image.naturalWidth || !image.naturalHeight) return;

  try {
    const canvas = document.createElement('canvas');
    canvas.width = 12;
    canvas.height = 12;
    const context = canvas.getContext('2d', { willReadFrequently: true });
    if (!context) return;
    context.drawImage(image, 0, 0, canvas.width, canvas.height);

    const { data } = context.getImageData(0, 0, canvas.width, canvas.height);
    let red = 0;
    let green = 0;
    let blue = 0;
    let count = 0;
    for (let index = 0; index < data.length; index += 4) {
      if (data[index + 3] < 100) continue;
      red += data[index];
      green += data[index + 1];
      blue += data[index + 2];
      count += 1;
    }
    if (!count) return;
    const color = [red, green, blue].map(channel => Math.round(channel / count));
    card.style.setProperty('--card-image-tone', `rgb(${color.join(' ')})`);
  } catch {
    // If canvas sampling is unavailable, CSS uses the interface accent as a fallback.
  }
}
