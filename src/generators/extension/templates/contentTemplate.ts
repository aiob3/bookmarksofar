export function renderContentScript(): string {
  return `/**
 * content.js — BookmarkSoFar Content Script
 *
 * Runs on every page to:
 *  - Provide the page summary / excerpt to the background worker on demand
 *  - Allow the popup to request the page metadata (title, description, og:image)
 */

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === 'GET_PAGE_META') {
    sendResponse(collectMeta());
    return false;
  }
});

function collectMeta() {
  const title = document.title || '';
  const url = location.href;
  const description =
    document.querySelector('meta[name="description"]')?.getAttribute('content') ||
    document.querySelector('meta[property="og:description"]')?.getAttribute('content') ||
    '';
  const image =
    document.querySelector('meta[property="og:image"]')?.getAttribute('content') || '';

  // Extract a short plain-text excerpt for AI summarisation
  const bodyText = document.body?.innerText?.trim().slice(0, 800) || '';

  return { title, url, description, image, excerpt: bodyText };
}
`;
}
