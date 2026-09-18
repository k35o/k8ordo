/**
 * How the server's HTML marks a Suspense boundary whose content is not in
 * place yet: `$?` while it is still on its way (or waiting on its
 * stylesheets), `$~` once it has arrived and waits for an animation frame to
 * be moved in.
 */
const UNREVEALED = new Set(['$?', '$~']);

const hasUnrevealed = (): boolean => {
  const walker = document.createTreeWalker(document, NodeFilter.SHOW_COMMENT);
  while (walker.nextNode()) {
    if (UNREVEALED.has((walker.currentNode as Comment).data)) return true;
  }
  return false;
};

/**
 * Settles once every Suspense boundary the server streamed into the document
 * is on screen — at once when none is waiting.
 */
export const whenRevealed = (): Promise<void> =>
  new Promise((resolve) => {
    if (!hasUnrevealed()) {
      resolve();
      return;
    }
    const observer = new MutationObserver(() => {
      if (hasUnrevealed()) return;
      observer.disconnect();
      resolve();
    });
    observer.observe(document, {
      subtree: true,
      childList: true,
      characterData: true,
    });
  });
