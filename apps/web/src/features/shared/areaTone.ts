import type { CSSProperties } from 'react';

export function areaToneStyle(area: string): CSSProperties {
  let hash = 2166136261;
  for (const character of area) hash = Math.imul(hash ^ character.charCodeAt(0), 16777619);
  const hue = (Math.imul(hash >>> 0, 2654435761) >>> 0) % 360;
  return { '--area-tone': `hsl(${hue} 48% 32%)` } as CSSProperties;
}
