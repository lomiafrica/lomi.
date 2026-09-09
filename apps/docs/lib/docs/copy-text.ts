/* @proprietary license */

function writeFallback(text: string): boolean {
  const area = document.createElement('textarea');
  area.value = text;
  area.setAttribute('readonly', '');
  area.setAttribute('contenteditable', 'true');
  area.style.position = 'fixed';
  area.style.top = '0';
  area.style.left = '0';
  area.style.opacity = '0';
  document.body.appendChild(area);
  area.focus();
  area.select();
  area.setSelectionRange(0, text.length);

  const selection = document.getSelection();
  const previous =
    selection && selection.rangeCount > 0 ? selection.getRangeAt(0) : null;

  let ok = false;
  try {
    ok = document.execCommand('copy');
  } catch {
    ok = false;
  }

  document.body.removeChild(area);
  if (selection && previous) {
    selection.removeAllRanges();
    selection.addRange(previous);
  }
  return ok;
}

/**
 * Copy during a click. `execCommand` runs synchronously so the user gesture
 * is still valid; `clipboard.writeText` is best-effort and not awaited.
 * Returns true when there was text to copy so the button can show Copied.
 */
export function copyTextNow(text: string): boolean {
  if (!text) return false;
  writeFallback(text);
  if ('navigator' in globalThis && globalThis.navigator.clipboard?.writeText) {
    void globalThis.navigator.clipboard.writeText(text).catch(() => undefined);
  }
  return true;
}
