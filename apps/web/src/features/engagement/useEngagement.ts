import { useCallback, useEffect, useState } from 'react';
import type { EngagementAction, EngagementContentType, EngagementItem } from './types';

const VISITOR_KEY = 'calmandstudy-engagement-visitor-v1';
type ResponseBody = { items?: EngagementItem[]; error?: string };

function visitorId() {
  try {
    let id = localStorage.getItem(VISITOR_KEY);
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem(VISITOR_KEY, id);
    }
    return id;
  } catch {
    return '';
  }
}

export function useEngagement() {
  const [items, setItems] = useState<EngagementItem[]>([]);
  const [available, setAvailable] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);
  const id = visitorId();

  const refresh = useCallback(async () => {
    if (!id) return;
    try {
      const response = await fetch(`/api/engagement?visitor=${encodeURIComponent(id)}`, {
        headers: { Accept: 'application/json' },
      });
      const body = (await response.json()) as ResponseBody;
      if (!response.ok || !body.items) throw new Error(body.error ?? 'Indisponível');
      setItems(body.items);
      setAvailable(true);
    } catch {
      setAvailable(false);
    }
  }, [id]);

  useEffect(() => void refresh(), [refresh]);

  const get = useCallback(
    (type: EngagementContentType, contentId: string) =>
      items.find(item => item.type === type && item.id === contentId) ?? {
        type,
        id: contentId,
        reads: 0,
        likes: 0,
        liked: false,
      },
    [items],
  );

  const send = useCallback(
    async (
      type: EngagementContentType,
      contentId: string,
      action: EngagementAction,
      liked?: boolean,
    ) => {
      if (!id || !available) return;
      const key = `${type}:${contentId}:${action}`;
      if (busy === key) return;
      setBusy(key);
      try {
        const response = await fetch('/api/engagement', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({
            visitorId: id,
            contentType: type,
            contentId,
            action,
            ...(action === 'like' ? { liked } : {}),
          }),
        });
        if (!response.ok) throw new Error('Não foi possível atualizar.');
        await refresh();
      } catch {
        /* Aggregate metrics remain unchanged when the API is unavailable. */
      } finally {
        setBusy(null);
      }
    },
    [available, busy, id, refresh],
  );

  const trackRead = useCallback(
    (type: EngagementContentType, contentId: string) => void send(type, contentId, 'read'),
    [send],
  );
  const toggleLike = useCallback(
    (type: EngagementContentType, contentId: string) => {
      const liked = get(type, contentId).liked;
      return send(type, contentId, 'like', !liked);
    },
    [get, send],
  );

  return { available, busy, get, trackRead, toggleLike };
}
