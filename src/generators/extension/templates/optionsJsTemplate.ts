export function renderOptionsJs(): string {
  return `/**
 * options.js — BookmarkSoFar Options Page
 */

const SETTINGS_KEY = '__bookmarkSoFarSettings';

async function loadSettings() {
  return new Promise(resolve => {
    chrome.storage.local.get([SETTINGS_KEY], result => {
      resolve(result[SETTINGS_KEY] || {});
    });
  });
}

async function saveSettings(settings) {
  return new Promise(resolve => {
    chrome.storage.local.set({ [SETTINGS_KEY]: settings }, resolve);
  });
}

// ─── AI Status ────────────────────────────────────────────────────────────

async function checkAI() {
  const statusEl = document.getElementById('ai-status-detail');
  try {
    if (!window.ai || !window.ai.languageModel) throw new Error('window.ai not found');
    const cap = await window.ai.languageModel.capabilities();
    if (cap.available === 'readily') {
      statusEl.innerHTML = '✅ <strong>Gemini Nano is ready</strong> — AI categorisation is active.';
      statusEl.style.color = '#4caf50';
    } else if (cap.available === 'after-download') {
      statusEl.innerHTML = '⏳ <strong>Gemini Nano is downloading</strong> — AI will be available soon.';
      statusEl.style.color = '#ffb300';
    } else {
      throw new Error('not available');
    }
  } catch (err) {
    statusEl.innerHTML =
      '⚠️ Gemini Nano is <strong>not available</strong>. ' +
      'Enable the required Chrome flags (see note above) or update Chrome to a recent version.';
    statusEl.style.color = '#ff7043';
  }
}

// ─── Export / Import ──────────────────────────────────────────────────────

async function exportMeta() {
  const data = await new Promise(resolve => chrome.storage.local.get(null, resolve));
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = 'bookmarksoFar-export.json';
  a.click();
  URL.revokeObjectURL(url);
}

async function importMeta(file) {
  const text = await file.text();
  const data = JSON.parse(text);
  await new Promise(resolve => chrome.storage.local.set(data, resolve));
  showStatus('Import successful!');
}

// ─── Helpers ──────────────────────────────────────────────────────────────

function showStatus(msg) {
  const el = document.getElementById('status-msg');
  el.textContent = msg;
  el.style.display = 'block';
  setTimeout(() => { el.style.display = 'none'; }, 3000);
}

// ─── Boot ─────────────────────────────────────────────────────────────────

async function boot() {
  checkAI();

  const settings = await loadSettings();
  const categoriesInput = document.getElementById('default-categories');
  if (settings.defaultCategories) {
    categoriesInput.value = settings.defaultCategories.join(', ');
  }

  document.getElementById('btn-save').addEventListener('click', async () => {
    const cats = categoriesInput.value
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);
    await saveSettings({ defaultCategories: cats });
    showStatus('Settings saved.');
  });

  document.getElementById('btn-export').addEventListener('click', exportMeta);

  document.getElementById('file-import').addEventListener('change', async e => {
    const file = e.target.files?.[0];
    if (file) await importMeta(file);
  });

  document.getElementById('btn-clear').addEventListener('click', async () => {
    if (confirm('This will delete all tags, notes, and AI categories. Continue?')) {
      await new Promise(resolve => chrome.storage.local.clear(resolve));
      showStatus('All metadata cleared.');
    }
  });
}

boot();
`;
}
