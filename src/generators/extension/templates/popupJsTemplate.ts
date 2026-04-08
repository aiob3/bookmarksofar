export function renderPopupJs(): string {
  return `/**
 * popup.js — BookmarkSoFar Extension Popup
 *
 * Integrates with:
 *  - chrome.bookmarks  (read/write bookmarks)
 *  - chrome.storage    (custom metadata: tags, notes, AI categories)
 *  - window.ai         (Gemini Nano local model for categorisation & search)
 */

// ─── Gemini Nano helpers ──────────────────────────────────────────────────

let aiSession = null;

async function initAI() {
  const statusEl = document.getElementById('ai-status');
  const statusText = document.getElementById('ai-status-text');
  const statusIcon = document.getElementById('ai-status-icon');

  try {
    if (!window.ai || !window.ai.languageModel) {
      throw new Error('window.ai not available');
    }

    const capabilities = await window.ai.languageModel.capabilities();

    if (capabilities.available === 'no') {
      throw new Error('Gemini Nano not available on this device');
    }

    if (capabilities.available === 'after-download') {
      statusText.textContent = 'Downloading Gemini Nano model…';
    }

    aiSession = await window.ai.languageModel.create({
      systemPrompt:
        'You are a bookmark categorisation assistant. ' +
        'Given a URL, page title, and optional note, respond with ONLY a single short category label ' +
        '(2-3 words max, title case). Examples: "AI Research", "Dev Tools", "News & Media", "Finance".'
    });

    statusEl.classList.add('ready');
    statusIcon.textContent = '✅';
    statusText.textContent = 'Gemini Nano ready (local AI)';
  } catch (err) {
    statusEl.classList.add('unavailable');
    statusIcon.textContent = '⚠️';
    statusText.textContent = 'Gemini Nano unavailable — manual tags only';
    console.warn('[BookmarkSoFar] AI init failed:', err.message);
  }
}

async function categoriseWithAI(url, title, note = '') {
  if (!aiSession) return null;
  try {
    const prompt =
      \`URL: \${url}\\nTitle: \${title}\\nNote: \${note}\\n\\nProvide the category:\`;
    const result = await aiSession.prompt(prompt);
    return result.trim().replace(/^["']|["']$/g, '');
  } catch {
    return null;
  }
}

async function semanticSearchWithAI(query, bookmarks) {
  if (!aiSession || !query) return bookmarks;
  try {
    const titles = bookmarks.map((b, i) => \`\${i}: \${b.title}\`).join('\\n');
    const prompt =
      \`Given the search query "\${query}", return a comma-separated list of \\n\` +
      \`indices (0-based) of the most relevant bookmarks from the list below.\\n\` +
      \`Only return numbers, no explanation.\\n\\n\${titles}\`;

    const result = await aiSession.prompt(prompt);
    const indices = result
      .split(',')
      .map(s => parseInt(s.trim(), 10))
      .filter(n => !isNaN(n) && n >= 0 && n < bookmarks.length);

    if (indices.length === 0) return bookmarks;
    return indices.map(i => bookmarks[i]);
  } catch {
    return bookmarks;
  }
}

// ─── Storage helpers ──────────────────────────────────────────────────────

async function getMeta(url) {
  return new Promise(resolve => {
    chrome.storage.local.get([url], result => resolve(result[url] || {}));
  });
}

async function setMeta(url, meta) {
  return new Promise(resolve => {
    chrome.storage.local.set({ [url]: meta }, resolve);
  });
}

async function getAllMeta() {
  return new Promise(resolve => {
    chrome.storage.local.get(null, resolve);
  });
}

// ─── Bookmark data layer ──────────────────────────────────────────────────

async function fetchAllBookmarks() {
  const tree = await chrome.bookmarks.getTree();
  const flat = [];
  function walk(nodes) {
    for (const node of nodes) {
      if (node.url) flat.push({ id: node.id, title: node.title, url: node.url, dateAdded: node.dateAdded });
      if (node.children) walk(node.children);
    }
  }
  walk(tree);
  return flat;
}

async function enrichBookmarks(raw) {
  const meta = await getAllMeta();
  return raw.map(b => ({ ...b, ...(meta[b.url] || {}) }));
}

async function saveBookmark(url, title, note, tags, aiCategory) {
  // Add to Chrome bookmarks
  await chrome.bookmarks.create({ title, url });

  // Store metadata
  const tagList = tags
    .split(',')
    .map(t => t.trim())
    .filter(Boolean);

  await setMeta(url, {
    note,
    tags: tagList,
    category: aiCategory || 'Uncategorised',
    savedAt: Date.now()
  });
}

async function deleteBookmark(id, url) {
  await chrome.bookmarks.remove(id);
  await chrome.storage.local.remove(url);
}

// ─── Render helpers ───────────────────────────────────────────────────────

function getFavicon(url) {
  try {
    const origin = new URL(url).origin;
    return \`https://www.google.com/s2/favicons?domain=\${origin}&sz=32\`;
  } catch {
    return '';
  }
}

function renderBookmarkItem(bookmark) {
  const item = document.createElement('div');
  item.className = 'bookmark-item';
  item.dataset.id = bookmark.id;
  item.dataset.url = bookmark.url;

  const favicon = getFavicon(bookmark.url);
  const tags = (bookmark.tags || []).map(t => \`<span class="bookmark-tag">\${escHtml(t)}</span>\`).join('');
  const category = bookmark.category
    ? \`<span class="bookmark-category">\${escHtml(bookmark.category)}</span>\`
    : '';
  const note = bookmark.note
    ? \`<div class="bookmark-note">\${escHtml(bookmark.note)}</div>\`
    : '';

  item.innerHTML = \`
    <img class="bookmark-favicon" src="\${favicon}" alt="" loading="lazy" />
    <div class="bookmark-info">
      <div class="bookmark-title">\${escHtml(bookmark.title || bookmark.url)}</div>
      <div class="bookmark-url">\${escHtml(bookmark.url)}</div>
      <div class="bookmark-meta">\${category}\${tags}</div>
      \${note}
    </div>
    <div class="bookmark-actions">
      <button class="btn-action btn-open" title="Open">↗</button>
      <button class="btn-action btn-delete" title="Remove">🗑</button>
    </div>
  \`;

  item.querySelector('.btn-open').addEventListener('click', e => {
    e.stopPropagation();
    chrome.tabs.create({ url: bookmark.url });
  });

  item.querySelector('.btn-delete').addEventListener('click', async e => {
    e.stopPropagation();
    await deleteBookmark(bookmark.id, bookmark.url);
    item.remove();
    checkEmpty();
  });

  item.addEventListener('click', () => chrome.tabs.create({ url: bookmark.url }));

  return item;
}

function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function checkEmpty() {
  const list = document.getElementById('bookmark-list');
  const empty = document.getElementById('empty-state');
  if (!list.querySelector('.bookmark-item')) {
    list.classList.add('hidden');
    empty.classList.remove('hidden');
  }
}

// ─── Category filter chips ────────────────────────────────────────────────

let allBookmarks = [];
let currentCategory = 'all';

function buildCategoryChips(bookmarks) {
  const categories = [...new Set(bookmarks.map(b => b.category).filter(Boolean))].sort();
  const container = document.getElementById('category-chips');
  container.innerHTML = '';
  categories.forEach(cat => {
    const chip = document.createElement('button');
    chip.className = 'filter-chip';
    chip.dataset.category = cat;
    chip.textContent = cat;
    chip.addEventListener('click', () => applyFilter(cat, chip));
    container.appendChild(chip);
  });
}

function applyFilter(category, chipEl) {
  currentCategory = category;
  document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
  chipEl.classList.add('active');
  renderList(filterBookmarks(allBookmarks));
}

function filterBookmarks(bookmarks) {
  if (currentCategory === 'all') return bookmarks;
  return bookmarks.filter(b => b.category === currentCategory);
}

function renderList(bookmarks) {
  const list = document.getElementById('bookmark-list');
  const empty = document.getElementById('empty-state');
  list.innerHTML = '';

  if (bookmarks.length === 0) {
    list.classList.add('hidden');
    empty.classList.remove('hidden');
    return;
  }

  list.classList.remove('hidden');
  empty.classList.add('hidden');
  bookmarks.forEach(b => list.appendChild(renderBookmarkItem(b)));
}

// ─── Search ───────────────────────────────────────────────────────────────

let searchDebounce = null;

function setupSearch() {
  const input = document.getElementById('search-input');
  input.addEventListener('input', () => {
    clearTimeout(searchDebounce);
    searchDebounce = setTimeout(() => runSearch(input.value.trim()), 300);
  });
}

async function runSearch(query) {
  const filtered = filterBookmarks(allBookmarks);
  if (!query) { renderList(filtered); return; }

  // Lexical fast-path
  const lower = query.toLowerCase();
  const lexical = filtered.filter(
    b =>
      b.title.toLowerCase().includes(lower) ||
      b.url.toLowerCase().includes(lower) ||
      (b.note || '').toLowerCase().includes(lower) ||
      (b.tags || []).some(t => t.toLowerCase().includes(lower))
  );

  // If AI is available and lexical results are sparse, use semantic search
  if (aiSession && lexical.length < 3) {
    const semantic = await semanticSearchWithAI(query, filtered);
    const combined = [...new Map([...lexical, ...semantic].map(b => [b.id, b])).values()];
    renderList(combined);
  } else {
    renderList(lexical);
  }
}

// ─── Save modal ───────────────────────────────────────────────────────────

let currentTab = null;

async function openSaveModal() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  currentTab = tab;

  document.getElementById('save-title').value = tab.title || '';
  document.getElementById('save-note').value = '';
  document.getElementById('save-tags').value = '';
  document.getElementById('ai-suggested-category').textContent = aiSession ? 'Analysing…' : 'AI unavailable';

  document.getElementById('save-modal').classList.remove('hidden');

  if (aiSession) {
    const category = await categoriseWithAI(tab.url, tab.title);
    document.getElementById('ai-suggested-category').textContent = category || 'Uncategorised';
  }
}

function closeSaveModal() {
  document.getElementById('save-modal').classList.add('hidden');
  currentTab = null;
}

async function confirmSave() {
  if (!currentTab) return;

  const title = document.getElementById('save-title').value.trim() || currentTab.title;
  const note = document.getElementById('save-note').value.trim();
  const tags = document.getElementById('save-tags').value;
  const aiCategory = document.getElementById('ai-suggested-category').textContent;

  await saveBookmark(currentTab.url, title, note, tags, aiCategory);
  closeSaveModal();

  // Refresh list
  const raw = await fetchAllBookmarks();
  allBookmarks = await enrichBookmarks(raw);
  buildCategoryChips(allBookmarks);
  renderList(filterBookmarks(allBookmarks));
}

// ─── Boot ─────────────────────────────────────────────────────────────────

async function boot() {
  await initAI();

  const raw = await fetchAllBookmarks();
  allBookmarks = await enrichBookmarks(raw);

  buildCategoryChips(allBookmarks);
  renderList(filterBookmarks(allBookmarks));
  setupSearch();

  // Wire buttons
  document.getElementById('btn-save').addEventListener('click', openSaveModal);
  document.getElementById('btn-options').addEventListener('click', () =>
    chrome.runtime.openOptionsPage()
  );
  document.getElementById('btn-cancel-save').addEventListener('click', closeSaveModal);
  document.getElementById('btn-confirm-save').addEventListener('click', confirmSave);
  document.querySelector('.modal-overlay')?.addEventListener('click', closeSaveModal);

  document.querySelector('.filter-chip[data-category="all"]').addEventListener('click', e => {
    applyFilter('all', e.currentTarget);
  });
}

boot();
`;
}
