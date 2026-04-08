export function renderPopupHtml(extensionName: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${extensionName}</title>
  <link rel="stylesheet" href="popup.css" />
</head>
<body>
  <div id="app">
    <header class="header">
      <div class="header-title">
        <span class="logo">🔖</span>
        <h1>${extensionName}</h1>
      </div>
      <div class="header-actions">
        <button id="btn-save" class="btn btn-primary" title="Save current page">
          <span>+ Save</span>
        </button>
        <button id="btn-options" class="btn btn-icon" title="Options">⚙</button>
      </div>
    </header>

    <div class="search-bar">
      <input
        id="search-input"
        type="text"
        placeholder="Search bookmarks… (AI-powered)"
        autocomplete="off"
      />
      <span class="search-icon">🔍</span>
    </div>

    <div class="ai-status" id="ai-status">
      <span id="ai-status-icon">🤖</span>
      <span id="ai-status-text">Checking Gemini Nano…</span>
    </div>

    <div class="filters">
      <button class="filter-chip active" data-category="all">All</button>
      <div id="category-chips"></div>
    </div>

    <div id="bookmark-list" class="bookmark-list">
      <div class="loading-state">
        <span class="spinner"></span>
        <p>Loading your bookmarks…</p>
      </div>
    </div>

    <div id="empty-state" class="empty-state hidden">
      <span class="empty-icon">📚</span>
      <p>No bookmarks yet.</p>
      <p class="empty-sub">Visit a page and click <strong>+ Save</strong> to start.</p>
    </div>

    <div id="save-modal" class="modal hidden">
      <div class="modal-overlay"></div>
      <div class="modal-card">
        <h2>Save Bookmark</h2>
        <div class="form-group">
          <label for="save-title">Title</label>
          <input id="save-title" type="text" placeholder="Page title" />
        </div>
        <div class="form-group">
          <label for="save-note">Note <span class="optional">(optional)</span></label>
          <textarea id="save-note" placeholder="Why are you saving this?"></textarea>
        </div>
        <div class="form-group">
          <label for="save-tags">Tags <span class="optional">(optional)</span></label>
          <input id="save-tags" type="text" placeholder="Comma-separated tags" />
        </div>
        <div class="form-group" id="ai-category-group">
          <label>AI Category</label>
          <div id="ai-suggested-category" class="ai-badge">Analysing…</div>
        </div>
        <div class="modal-actions">
          <button id="btn-cancel-save" class="btn btn-secondary">Cancel</button>
          <button id="btn-confirm-save" class="btn btn-primary">Save</button>
        </div>
      </div>
    </div>
  </div>

  <script src="popup.js" type="module"></script>
</body>
</html>
`;
}
