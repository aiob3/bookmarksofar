export function renderExtensionReadme(extensionName: string, extensionDescription: string): string {
  return `# ${extensionName}

> ${extensionDescription}

## 🚀 Overview

**${extensionName}** is a Chrome extension (Manifest V3) that solves the "save-and-forget" bookmark problem. Using **Gemini Nano**—Google's on-device AI built into Chrome—every saved bookmark is automatically categorised _locally_, with no data ever leaving your device.

### Core Features

| Feature | Description |
|---------|-------------|
| 🔖 **Smart Save** | Popup lets you add a note and tags; AI suggests a category instantly |
| 🤖 **Gemini Nano** | On-device categorisation via \`window.ai.languageModel\` (no API key required) |
| 🔍 **AI Search** | Semantic search falls back to Gemini Nano when lexical results are sparse |
| 🗂 **Category Filters** | One-click filter chips built from your saved categories |
| 🖱 **Context Menu** | Right-click any page or link → _Save to ${extensionName}_ |
| ⚙ **Options Page** | Manage default categories, export/import metadata, and check AI status |

---

## 🏗 Project Structure

\`\`\`
extension/
├── manifest.json          # Chrome Manifest V3
├── popup/
│   ├── popup.html         # Extension popup UI
│   ├── popup.css          # Styles (dark theme)
│   └── popup.js           # Logic: bookmarks API + Gemini Nano integration
├── background/
│   └── background.js      # Service worker: context menu, badge count, AI bridge
├── content/
│   └── content.js         # Content script: page meta extraction
├── options/
│   ├── options.html       # Options page
│   └── options.js         # Options logic: settings, export/import
└── icons/                 # Extension icons (16, 32, 48, 128 px)
\`\`\`

---

## 🤖 Gemini Nano Integration

${extensionName} uses the [Chrome Built-in AI (Prompt API)](https://developer.chrome.com/docs/ai/built-in) introduced in Chrome 127+.

### Enabling Gemini Nano (Development)

1. Open \`chrome://flags/#prompt-api-for-gemini-nano\` → **Enabled**
2. Open \`chrome://flags/#optimization-guide-on-device-model\` → **Enabled BypassPerfRequirement**
3. Relaunch Chrome
4. Visit \`chrome://components\` → find **Optimization Guide On Device Model** → click **Check for update**

### API Usage Pattern

\`\`\`js
// Check availability
const cap = await window.ai.languageModel.capabilities();

if (cap.available === 'readily') {
  const session = await window.ai.languageModel.create({
    systemPrompt: 'You are a bookmark categorisation assistant…'
  });
  const category = await session.prompt(\`URL: \${url}\\nTitle: \${title}\`);
  await session.destroy();
}
\`\`\`

> **Privacy**: All AI inference runs entirely on-device. No bookmark data is sent to any server.

---

## 🔧 Installation (Unpacked)

1. Build or copy the \`extension/\` directory.
2. Open **chrome://extensions** in Chrome.
3. Enable **Developer mode** (top-right toggle).
4. Click **Load unpacked** and select the \`extension/\` folder.
5. The 🔖 icon should appear in your toolbar.

---

## 🌐 Web App Companion

A companion web app (\`web-app/\`) can provide a full-page bookmark library view. Both the extension and the web app share the same Chrome Storage data layer, so your bookmarks are always in sync.

---

## 📋 Roadmap

- [ ] Gemini Nano summarisation of page content on save
- [ ] Duplicate bookmark detection with AI similarity matching
- [ ] Export to Markdown / CSV
- [ ] Firefox / Edge (Comet) compatibility layer
- [ ] Web app companion with advanced filtering and full-text search

---

## 📄 License

MIT
`;
}
