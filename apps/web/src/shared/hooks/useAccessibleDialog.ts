import { useEffect, useRef } from 'react';

const focusableSelector =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function useAccessibleDialog(active: boolean, title: string, onClose: () => void) {
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  useEffect(() => {
    if (!active) return;
    const shell = document.querySelector<HTMLElement>('.shell');
    const overlays = [...(shell?.querySelectorAll<HTMLElement>('.overlay') ?? [])];
    const overlay = overlays[overlays.length - 1];
    const dialog =
      overlay?.querySelector<HTMLElement>('[role="dialog"]') ??
      overlay?.querySelector<HTMLElement>('.reader, .tutorial-dialog, .suggestion-dialog');
    if (!shell || !overlay || !dialog) return;
    if (!dialog.hasAttribute('role')) dialog.setAttribute('role', 'dialog');
    if (!dialog.hasAttribute('aria-labelledby') && !dialog.hasAttribute('aria-label'))
      dialog.setAttribute('aria-label', title);
    dialog.setAttribute('aria-modal', 'true');
    if (!dialog.hasAttribute('tabindex')) dialog.tabIndex = -1;
    const previousFocus =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const originalOverflow = document.body.style.overflow;
    const siblingState = [...shell.children]
      .filter((child): child is HTMLElement => child instanceof HTMLElement && child !== overlay)
      .map(element => ({
        element,
        inert: element.inert,
        ariaHidden: element.getAttribute('aria-hidden'),
      }));
    siblingState.forEach(({ element }) => {
      element.inert = true;
      element.setAttribute('aria-hidden', 'true');
    });
    document.body.style.overflow = 'hidden';
    const firstFocusable = dialog.querySelector<HTMLElement>(focusableSelector);
    (firstFocusable ?? dialog).focus();

    const keepFocusInside = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeRef.current();
        return;
      }
      if (event.key !== 'Tab') return;
      const focusable = [...dialog.querySelectorAll<HTMLElement>(focusableSelector)].filter(
        element => element.getClientRects().length > 0,
      );
      if (!focusable.length) {
        event.preventDefault();
        dialog.focus();
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (
        event.shiftKey &&
        (document.activeElement === first || !dialog.contains(document.activeElement))
      ) {
        event.preventDefault();
        last.focus();
      } else if (
        !event.shiftKey &&
        (document.activeElement === last || !dialog.contains(document.activeElement))
      ) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', keepFocusInside);
    return () => {
      document.removeEventListener('keydown', keepFocusInside);
      document.body.style.overflow = originalOverflow;
      siblingState.forEach(({ element, inert, ariaHidden }) => {
        element.inert = inert;
        if (ariaHidden === null) element.removeAttribute('aria-hidden');
        else element.setAttribute('aria-hidden', ariaHidden);
      });
      previousFocus?.focus();
    };
  }, [active, title]);
}
