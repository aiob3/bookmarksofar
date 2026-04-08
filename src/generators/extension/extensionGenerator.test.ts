import * as os from 'os';
import * as path from 'path';
import * as fs from 'fs-extra';

import { ExtensionGenerator } from './extensionGenerator';

describe('ExtensionGenerator', () => {
  let tempDir: string;
  let outputDir: string;
  const generator = new ExtensionGenerator();

  beforeEach(async () => {
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'ai-context-ext-'));
    outputDir = path.join(tempDir, '.context');
    await fs.ensureDir(outputDir);
  });

  afterEach(async () => {
    if (tempDir) {
      await fs.remove(tempDir);
    }
  });

  it('generates all expected Chrome Extension scaffold files', async () => {
    const created = await generator.generateExtension(outputDir);

    expect(created).toBe(9);

    const extDir = path.join(outputDir, 'extension');
    const expectedFiles = [
      'manifest.json',
      'popup/popup.html',
      'popup/popup.css',
      'popup/popup.js',
      'background/background.js',
      'content/content.js',
      'options/options.html',
      'options/options.js',
      'README.md',
    ];

    for (const filePath of expectedFiles) {
      const exists = await fs.pathExists(path.join(extDir, filePath));
      expect(exists).toBe(true);
    }
  });

  it('generates a valid Manifest V3 manifest.json', async () => {
    await generator.generateExtension(outputDir);

    const manifestPath = path.join(outputDir, 'extension', 'manifest.json');
    const raw = await fs.readFile(manifestPath, 'utf8');
    const manifest = JSON.parse(raw);

    expect(manifest.manifest_version).toBe(3);
    expect(manifest.permissions).toContain('bookmarks');
    expect(manifest.permissions).toContain('storage');
    expect(manifest.background.service_worker).toBe('background/background.js');
    expect(manifest.action.default_popup).toBe('popup/popup.html');
    expect(manifest.options_ui.page).toBe('options/options.html');
  });

  it('respects custom extensionName and extensionDescription', async () => {
    await generator.generateExtension(outputDir, {
      extensionName: 'MyBookmarks',
      extensionDescription: 'A custom bookmark manager.',
    });

    const extDir = path.join(outputDir, 'extension');

    const raw = await fs.readFile(path.join(extDir, 'manifest.json'), 'utf8');
    const manifest = JSON.parse(raw);
    expect(manifest.name).toBe('MyBookmarks');
    expect(manifest.description).toBe('A custom bookmark manager.');

    const popupHtml = await fs.readFile(path.join(extDir, 'popup/popup.html'), 'utf8');
    expect(popupHtml).toContain('MyBookmarks');

    const readme = await fs.readFile(path.join(extDir, 'README.md'), 'utf8');
    expect(readme).toContain('MyBookmarks');
    expect(readme).toContain('A custom bookmark manager.');
  });

  it('popup.js includes Gemini Nano (window.ai) integration', async () => {
    await generator.generateExtension(outputDir);

    const popupJs = await fs.readFile(
      path.join(outputDir, 'extension', 'popup/popup.js'),
      'utf8'
    );

    expect(popupJs).toContain('window.ai');
    expect(popupJs).toContain('languageModel');
    expect(popupJs).toContain('chrome.bookmarks');
    expect(popupJs).toContain('chrome.storage');
  });

  it('background.js registers a context menu and bookmark badge', async () => {
    await generator.generateExtension(outputDir);

    const bgJs = await fs.readFile(
      path.join(outputDir, 'extension', 'background/background.js'),
      'utf8'
    );

    expect(bgJs).toContain('chrome.contextMenus');
    expect(bgJs).toContain('chrome.bookmarks.onCreated');
    expect(bgJs).toContain('chrome.action.setBadgeText');
  });

  it('content.js collects page metadata', async () => {
    await generator.generateExtension(outputDir);

    const contentJs = await fs.readFile(
      path.join(outputDir, 'extension', 'content/content.js'),
      'utf8'
    );

    expect(contentJs).toContain('GET_PAGE_META');
    expect(contentJs).toContain('collectMeta');
    expect(contentJs).toContain('document.title');
  });

  it('README.md documents the Gemini Nano setup steps', async () => {
    await generator.generateExtension(outputDir);

    const readme = await fs.readFile(
      path.join(outputDir, 'extension', 'README.md'),
      'utf8'
    );

    expect(readme).toContain('Gemini Nano');
    expect(readme).toContain('window.ai.languageModel');
    expect(readme).toContain('chrome://flags');
  });
});
