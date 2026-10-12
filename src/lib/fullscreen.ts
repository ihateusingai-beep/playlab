/**
 * Fullscreen helpers. Desktop browsers use the iframe's native fullscreen
 * API. iOS Safari and other browsers without a real fullscreen API fall
 * back to a pseudo-fullscreen that covers the viewport and locks the
 * outer page scroll.
 */
export function isFullscreenSupported(): boolean {
  if (typeof document === 'undefined') return false;
  return !!(
    document.fullscreenEnabled ||
    (document as Document & { webkitFullscreenEnabled?: boolean })
      .webkitFullscreenEnabled
  );
}

export async function enterFullscreen(el: HTMLElement): Promise<void> {
  if (isFullscreenSupported()) {
    if (el.requestFullscreen) {
      await el.requestFullscreen();
      return;
    }
    const w = el as HTMLElement & {
      webkitRequestFullscreen?: () => Promise<void> | void;
    };
    if (w.webkitRequestFullscreen) {
      await w.webkitRequestFullscreen();
      return;
    }
  }
  // Pseudo-fullscreen fallback.
  el.dataset.pseudoFs = '1';
  el.classList.add('pseudo-fs');
  document.body.classList.add('overflow-hidden');
}

export async function exitFullscreen(el: HTMLElement): Promise<void> {
  if (document.fullscreenElement || (document as Document & { webkitFullscreenElement?: Element }).webkitFullscreenElement) {
    if (document.exitFullscreen) {
      await document.exitFullscreen();
      return;
    }
    const d = document as Document & { webkitExitFullscreen?: () => void };
    if (d.webkitExitFullscreen) {
      d.webkitExitFullscreen();
      return;
    }
  }
  if (el.dataset.pseudoFs === '1') {
    delete el.dataset.pseudoFs;
    el.classList.remove('pseudo-fs');
    document.body.classList.remove('overflow-hidden');
  }
}

export function isFullscreenActive(el: HTMLElement): boolean {
  if (document.fullscreenElement === el) return true;
  const d = document as Document & { webkitFullscreenElement?: Element };
  if (d.webkitFullscreenElement === el) return true;
  return el.dataset.pseudoFs === '1';
}
