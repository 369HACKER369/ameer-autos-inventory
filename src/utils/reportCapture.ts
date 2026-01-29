import { toPng } from 'html-to-image';

export type CapturedSection = {
  title: string;
  dataUrl: string; // PNG data URL
};

function getElementBackgroundColor(el: HTMLElement): string | undefined {
  const bg = window.getComputedStyle(el).backgroundColor;
  // If transparent, let html-to-image pick up inherited background.
  if (!bg) return undefined;
  if (bg === 'transparent') return undefined;
  // rgba(0, 0, 0, 0)
  if (bg.startsWith('rgba') && bg.endsWith(', 0)')) return undefined;
  return bg;
}

function raf(): Promise<void> {
  return new Promise((resolve) => requestAnimationFrame(() => resolve()));
}

/**
 * Captures an on-screen report section to a PNG data URL without changing UI state.
 */
export async function captureElementAsPng(el: HTMLElement): Promise<string> {
  // Let ongoing chart animations/layout settle for a frame.
  await raf();
  await raf();

  const backgroundColor = getElementBackgroundColor(el);

  return toPng(el, {
    cacheBust: true,
    pixelRatio: 2,
    backgroundColor,
  });
}
