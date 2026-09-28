export function renderPopupCss(): string {
  return `/* ─── Reset & Variables ─────────────────────────────────────────────────── */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --color-bg:        #1a1a2e;
  --color-surface:   #16213e;
  --color-primary:   #0f3460;
  --color-accent:    #e94560;
  --color-text:      #e0e0e0;
  --color-muted:     #8888aa;
  --color-border:    #2a2a4e;
  --radius:          8px;
  --popup-width:     380px;
  --popup-max-height:580px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* ─── App Shell ─────────────────────────────────────────────────────────── */
body {
  background: var(--color-bg);
  color: var(--color-text);
  width: var(--popup-width);
  max-height: var(--popup-max-height);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

#app { display: flex; flex-direction: column; height: var(--popup-max-height); }

/* ─── Header ────────────────────────────────────────────────────────────── */
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 14px;
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
}

.header-title {
  display: flex;
  align-items: center;
  gap: 8px;
}

.header-title h1 { font-size: 1rem; font-weight: 600; }
.logo { font-size: 1.2rem; }

.header-actions { display: flex; gap: 6px; }

/* ─── Buttons ───────────────────────────────────────────────────────────── */
.btn {
  border: none;
  border-radius: var(--radius);
  cursor: pointer;
  font-size: 0.8rem;
  padding: 6px 12px;
  transition: opacity 0.15s;
}
.btn:hover { opacity: 0.85; }

.btn-primary { background: var(--color-accent); color: #fff; font-weight: 600; }
.btn-secondary { background: var(--color-border); color: var(--color-text); }
.btn-icon { background: transparent; font-size: 1rem; padding: 4px 8px; color: var(--color-muted); }
.btn-icon:hover { color: var(--color-text); }

/* ─── Search ────────────────────────────────────────────────────────────── */
.search-bar {
  position: relative;
  padding: 10px 14px;
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
}

.search-bar input {
  width: 100%;
  background: var(--color-primary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  color: var(--color-text);
  font-size: 0.85rem;
  outline: none;
  padding: 7px 32px 7px 10px;
}

.search-bar input::placeholder { color: var(--color-muted); }
.search-bar input:focus { border-color: var(--color-accent); }
.search-icon { position: absolute; right: 24px; top: 50%; transform: translateY(-50%); color: var(--color-muted); }

/* ─── AI Status ─────────────────────────────────────────────────────────── */
.ai-status {
  align-items: center;
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
  display: flex;
  font-size: 0.75rem;
  gap: 6px;
  padding: 5px 14px;
  color: var(--color-muted);
}

.ai-status.ready { color: #4caf50; }
.ai-status.unavailable { color: #ff7043; }

/* ─── Filter Chips ──────────────────────────────────────────────────────── */
.filters {
  align-items: center;
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  padding: 8px 14px;
  overflow-x: auto;
}

.filter-chip {
  background: var(--color-primary);
  border: 1px solid var(--color-border);
  border-radius: 20px;
  color: var(--color-muted);
  cursor: pointer;
  font-size: 0.75rem;
  padding: 3px 10px;
  white-space: nowrap;
}

.filter-chip.active,
.filter-chip:hover { background: var(--color-accent); border-color: var(--color-accent); color: #fff; }

/* ─── Bookmark List ─────────────────────────────────────────────────────── */
.bookmark-list {
  flex: 1;
  overflow-y: auto;
  padding: 8px 0;
}

.bookmark-item {
  align-items: flex-start;
  border-bottom: 1px solid var(--color-border);
  cursor: pointer;
  display: flex;
  gap: 10px;
  padding: 10px 14px;
  transition: background 0.15s;
}

.bookmark-item:hover { background: var(--color-surface); }
.bookmark-item:last-child { border-bottom: none; }

.bookmark-favicon {
  border-radius: 4px;
  flex-shrink: 0;
  height: 20px;
  object-fit: contain;
  width: 20px;
}

.bookmark-info { flex: 1; min-width: 0; }

.bookmark-title {
  color: var(--color-text);
  font-size: 0.85rem;
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.bookmark-url {
  color: var(--color-muted);
  font-size: 0.72rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.bookmark-meta {
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-top: 3px;
}

.bookmark-category,
.bookmark-tag {
  background: var(--color-primary);
  border-radius: 4px;
  color: var(--color-muted);
  font-size: 0.65rem;
  padding: 1px 5px;
}

.bookmark-category { background: #0f3460; color: #64b5f6; }

.bookmark-note {
  color: var(--color-muted);
  font-size: 0.75rem;
  margin-top: 4px;
}

.bookmark-actions {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.btn-action {
  background: transparent;
  border: none;
  color: var(--color-muted);
  cursor: pointer;
  font-size: 0.85rem;
  padding: 2px 4px;
  transition: color 0.15s;
}

.btn-action:hover { color: var(--color-text); }

/* ─── Loading / Empty States ─────────────────────────────────────────────── */
.loading-state,
.empty-state {
  align-items: center;
  display: flex;
  flex-direction: column;
  gap: 8px;
  justify-content: center;
  padding: 40px 20px;
  text-align: center;
}

.empty-icon { font-size: 2.5rem; }
.empty-sub { color: var(--color-muted); font-size: 0.8rem; }

.hidden { display: none !important; }

.spinner {
  animation: spin 0.8s linear infinite;
  border: 3px solid var(--color-border);
  border-radius: 50%;
  border-top-color: var(--color-accent);
  display: inline-block;
  height: 24px;
  width: 24px;
}

@keyframes spin { to { transform: rotate(360deg); } }

/* ─── Modal ─────────────────────────────────────────────────────────────── */
.modal {
  inset: 0;
  position: absolute;
  z-index: 100;
}

.modal-overlay {
  background: rgba(0,0,0,0.6);
  height: 100%;
  left: 0;
  position: absolute;
  top: 0;
  width: 100%;
}

.modal-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  left: 50%;
  padding: 20px;
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 340px;
  z-index: 101;
}

.modal-card h2 { font-size: 1rem; margin-bottom: 14px; }

.form-group { display: flex; flex-direction: column; gap: 4px; margin-bottom: 12px; }

.form-group label { color: var(--color-muted); font-size: 0.78rem; }
.optional { font-size: 0.7rem; color: #666; }

.form-group input,
.form-group textarea {
  background: var(--color-primary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  color: var(--color-text);
  font-size: 0.82rem;
  outline: none;
  padding: 7px 10px;
  resize: vertical;
}

.form-group input:focus,
.form-group textarea:focus { border-color: var(--color-accent); }

.ai-badge {
  background: var(--color-primary);
  border: 1px solid var(--color-border);
  border-radius: 20px;
  color: #64b5f6;
  display: inline-block;
  font-size: 0.78rem;
  padding: 4px 10px;
}

.modal-actions { display: flex; gap: 8px; justify-content: flex-end; margin-top: 16px; }
`;
}
