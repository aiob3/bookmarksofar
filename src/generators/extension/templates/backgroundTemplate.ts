export function renderBackground(): string {
  return `/**
 * background.js — BookmarkSoFar Service Worker
 *
 * Responsibilities:
 *  - Listen for bookmark creation events and auto-categorise via Gemini Nano
 *  - Provide a context-menu shortcut to save the current page
 *  - Notify the popup when new bookmarks are saved
 */

// ─── Context menu ─────────────────────────────────────────────────────────

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus?.create({
    id: 'bookmark-soFar-save',
    title: 'Save to BookmarkSoFar',
    contexts: ['page', 'link']
  });
});

chrome.contextMenus?.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId !== 'bookmark-soFar-save') return;

  const url   = info.linkUrl || tab?.url || '';
  const title = info.selectionText || tab?.title || url;

  if (!url) return;

  try {
    await chrome.bookmarks.create({ title, url });

    let category = 'Uncategorised';
    try {
      const aiCategory = await categorieSingle(url, title);
      if (aiCategory) category = aiCategory;
    } catch { /* AI unavailable — proceed without category */ }

    await chrome.storage.local.set({
      [url]: { category, tags: [], note: '', savedAt: Date.now() }
    });

    chrome.action.setBadgeText({ text: '✓' });
    setTimeout(() => chrome.action.setBadgeText({ text: '' }), 2000);
  } catch (err) {
    console.error('[BookmarkSoFar] Error saving from context menu:', err);
  }
});

// ─── Gemini Nano (service-worker edition) ────────────────────────────────
// NOTE: window.ai is not available in service workers.
// Categorisation in the background worker is done via message passing to
// the popup, which has access to window.ai. This stub shows the pattern.

async function categorieSingle(url, title) {
  // Attempt to use the Prompt API if available in the SW context (future Chrome versions)
  if (typeof self.ai !== 'undefined' && self.ai.languageModel) {
    try {
      const session = await self.ai.languageModel.create({
        systemPrompt:
          'You are a bookmark categorisation assistant. ' +
          'Given a URL and title, respond with ONLY a single short category label (2-3 words max, title case).'
      });
      const result = await session.prompt(\`URL: \${url}\\nTitle: \${title}\\nProvide the category:\`);
      await session.destroy();
      return result.trim().replace(/^["']|["']$/g, '');
    } catch {
      return null;
    }
  }
  return null;
}

// ─── Message bridge ───────────────────────────────────────────────────────

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === 'GET_BOOKMARK_COUNT') {
    chrome.bookmarks.getTree(tree => {
      let count = 0;
      function walk(nodes) {
        for (const n of nodes) {
          if (n.url) count++;
          if (n.children) walk(n.children);
        }
      }
      walk(tree);
      sendResponse({ count });
    });
    return true; // async response
  }
});

// ─── Badge: show total bookmark count ────────────────────────────────────

async function updateBadge() {
  const tree = await chrome.bookmarks.getTree();
  let count = 0;
  function walk(nodes) {
    for (const n of nodes) {
      if (n.url) count++;
      if (n.children) walk(n.children);
    }
  }
  walk(tree);
  chrome.action.setBadgeText({ text: count > 0 ? String(count) : '' });
  chrome.action.setBadgeBackgroundColor({ color: '#e94560' });
}

chrome.bookmarks.onCreated.addListener(updateBadge);
chrome.bookmarks.onRemoved.addListener(updateBadge);
updateBadge();
`;
}
