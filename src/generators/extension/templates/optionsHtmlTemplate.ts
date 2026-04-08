export function renderOptionsHtml(extensionName: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${extensionName} — Options</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    :root {
      --bg: #1a1a2e; --surface: #16213e; --primary: #0f3460;
      --accent: #e94560; --text: #e0e0e0; --muted: #8888aa;
      --border: #2a2a4e; --radius: 8px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }
    body { background: var(--bg); color: var(--text); padding: 40px; min-height: 100vh; }
    h1 { font-size: 1.4rem; margin-bottom: 6px; }
    h2 { font-size: 1rem; margin-bottom: 12px; color: var(--muted); }
    .card {
      background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius);
      margin-bottom: 20px; max-width: 560px; padding: 20px;
    }
    .form-group { display: flex; flex-direction: column; gap: 6px; margin-bottom: 14px; }
    label { color: var(--muted); font-size: 0.82rem; }
    input, select, textarea {
      background: var(--primary); border: 1px solid var(--border); border-radius: var(--radius);
      color: var(--text); font-size: 0.85rem; outline: none; padding: 8px 10px;
    }
    input:focus, select:focus, textarea:focus { border-color: var(--accent); }
    .btn {
      border: none; border-radius: var(--radius); cursor: pointer;
      font-size: 0.85rem; padding: 8px 18px; transition: opacity .15s;
    }
    .btn:hover { opacity: .85; }
    .btn-primary { background: var(--accent); color: #fff; font-weight: 600; }
    .btn-secondary { background: var(--border); color: var(--text); }
    .actions { display: flex; gap: 10px; margin-top: 6px; }
    .status-msg { color: #4caf50; font-size: 0.8rem; margin-top: 8px; }
    .ai-note { background: var(--primary); border-radius: var(--radius); color: var(--muted);
               font-size: 0.78rem; padding: 10px 14px; margin-top: 6px; }
    #ai-status-detail { margin-top: 10px; font-size: 0.8rem; color: var(--muted); }
  </style>
</head>
<body>
  <h1>🔖 ${extensionName}</h1>
  <h2>Options & Settings</h2>

  <div class="card">
    <h3 style="margin-bottom:12px;">Default Categories</h3>
    <div class="form-group">
      <label for="default-categories">
        Comma-separated default categories (AI will use these as suggestions)
      </label>
      <input id="default-categories" type="text"
             placeholder="AI Research, Dev Tools, News, Finance, Learning…" />
    </div>
    <div class="ai-note">
      💡 Gemini Nano will auto-categorise new bookmarks using these labels as guidance.
    </div>
  </div>

  <div class="card">
    <h3 style="margin-bottom:12px;">Gemini Nano (Local AI)</h3>
    <div id="ai-status-detail">Checking availability…</div>
    <div class="ai-note" style="margin-top:12px;">
      <strong>What is Gemini Nano?</strong><br/>
      Gemini Nano is Google's on-device AI model built into Chrome. It runs entirely
      locally—no data leaves your device. If it reports as unavailable, enable
      <code>chrome://flags/#prompt-api-for-gemini-nano</code> and
      <code>chrome://flags/#optimization-guide-on-device-model</code>.
    </div>
  </div>

  <div class="card">
    <h3 style="margin-bottom:12px;">Export / Import</h3>
    <p style="color:var(--muted);font-size:.82rem;margin-bottom:12px;">
      Export your bookmark metadata (tags, notes, AI categories) as JSON.
    </p>
    <div class="actions">
      <button id="btn-export" class="btn btn-secondary">⬇ Export JSON</button>
      <label class="btn btn-secondary" style="cursor:pointer;">
        ⬆ Import JSON
        <input id="file-import" type="file" accept=".json" style="display:none;" />
      </label>
    </div>
  </div>

  <div class="card">
    <h3 style="margin-bottom:12px;">Danger Zone</h3>
    <button id="btn-clear" class="btn" style="background:#b71c1c;color:#fff;">
      🗑 Clear All Metadata
    </button>
    <div id="status-msg" class="status-msg" style="display:none;"></div>
  </div>

  <div class="actions" style="max-width:560px;">
    <button id="btn-save" class="btn btn-primary">Save Settings</button>
  </div>

  <script src="options.js" type="module"></script>
</body>
</html>
`;
}
