import { useEffect, useState, type Dispatch, type SetStateAction } from 'react';

/** Persist small, device-local interface state without coupling features to storage. */
export function useStoredState<T>(
  key: string,
  initialValue: T | (() => T),
  isValid: (value: unknown) => value is T,
): [T, Dispatch<SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => {
    const fallback =
      typeof initialValue === 'function' ? (initialValue as () => T)() : initialValue;
    if (typeof window === 'undefined') return fallback;

    try {
      const stored = window.localStorage.getItem(key);
      if (stored === null) return fallback;
      try {
        const parsed: unknown = JSON.parse(stored);
        return isValid(parsed) ? parsed : fallback;
      } catch {
        // Older string preferences were stored without JSON encoding.
        return isValid(stored) ? stored : fallback;
      }
    } catch {
      return fallback;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Storage can be disabled or full; the current session still works.
    }
  }, [key, value]);

  return [value, setValue];
}
