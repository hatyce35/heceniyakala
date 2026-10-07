/**
 * Cross-browser Fullscreen API helper for mobile phones, tablets, and desktop computers.
 */

export function isFullscreenSupported(): boolean {
  if (typeof document === 'undefined') return false;
  return Boolean(
    document.fullscreenEnabled ||
    (document as unknown as { webkitFullscreenEnabled?: boolean }).webkitFullscreenEnabled ||
    (document as unknown as { mozFullScreenEnabled?: boolean }).mozFullScreenEnabled ||
    (document as unknown as { msFullscreenEnabled?: boolean }).msFullscreenEnabled
  );
}

export function isCurrentlyFullscreen(): boolean {
  if (typeof document === 'undefined') return false;
  return Boolean(
    document.fullscreenElement ||
    (document as unknown as { webkitFullscreenElement?: Element }).webkitFullscreenElement ||
    (document as unknown as { mozFullScreenElement?: Element }).mozFullScreenElement ||
    (document as unknown as { msFullscreenElement?: Element }).msFullscreenElement
  );
}

export async function toggleFullscreen(): Promise<boolean> {
  if (typeof document === 'undefined') return false;
  try {
    if (!isCurrentlyFullscreen()) {
      const elem = document.documentElement;
      if (elem.requestFullscreen) {
        await elem.requestFullscreen();
      } else if ((elem as unknown as { webkitRequestFullscreen?: () => Promise<void> }).webkitRequestFullscreen) {
        await (elem as unknown as { webkitRequestFullscreen: () => Promise<void> }).webkitRequestFullscreen();
      } else if ((elem as unknown as { msRequestFullscreen?: () => Promise<void> }).msRequestFullscreen) {
        await (elem as unknown as { msRequestFullscreen: () => Promise<void> }).msRequestFullscreen();
      }
      return true;
    } else {
      if (document.exitFullscreen) {
        await document.exitFullscreen();
      } else if ((document as unknown as { webkitExitFullscreen?: () => Promise<void> }).webkitExitFullscreen) {
        await (document as unknown as { webkitExitFullscreen: () => Promise<void> }).webkitExitFullscreen();
      } else if ((document as unknown as { msExitFullscreen?: () => Promise<void> }).msExitFullscreen) {
        await (document as unknown as { msExitFullscreen: () => Promise<void> }).msExitFullscreen();
      }
      return false;
    }
  } catch {
    return isCurrentlyFullscreen();
  }
}
