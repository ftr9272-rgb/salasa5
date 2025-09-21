// Global image fallback: replaces images that fail to load with a local placeholder.
export function installImageFallback({ fallback = '/assets/placeholder.png' } = {}) {
  function handler(e) {
    const el = e.target;
    if (el && el.tagName === 'IMG') {
      if (!el.dataset.fallbackApplied) {
        el.dataset.fallbackApplied = '1';
        el.src = fallback;
      }
    }
  }

  // Use capture to catch error events on images
  window.addEventListener('error', handler, true);
  return () => window.removeEventListener('error', handler, true);
}
