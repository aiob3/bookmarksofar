import * as path from 'path';
import { GeneratorUtils } from '../shared';
import {
  renderManifest,
  renderPopupHtml,
  renderPopupCss,
  renderPopupJs,
  renderBackground,
  renderContentScript,
  renderOptionsHtml,
  renderOptionsJs,
  renderExtensionReadme,
} from './templates';

export interface ExtensionGeneratorConfig {
  extensionName?: string;
  extensionDescription?: string;
}

interface GeneratedFile {
  relativePath: string;
  content: string;
}

export class ExtensionGenerator {
  async generateExtension(
    outputDir: string,
    config: ExtensionGeneratorConfig = {},
    verbose: boolean = false
  ): Promise<number> {
    const extensionName = config.extensionName || 'BookmarkSoFar';
    const extensionDescription =
      config.extensionDescription ||
      'Rediscover your saved bookmarks with Gemini Nano on-device AI.';

    const extDir = path.join(outputDir, 'extension');
    await GeneratorUtils.ensureDirectoryAndLog(extDir, verbose, 'Generating Chrome Extension scaffold in');

    const files = this.buildFileList(extensionName, extensionDescription);

    let created = 0;
    for (const file of files) {
      const fullPath = path.join(extDir, file.relativePath);
      const dir = path.dirname(fullPath);
      await GeneratorUtils.ensureDirectoryAndLog(dir, false, '');
      await GeneratorUtils.writeFileWithLogging(
        fullPath,
        file.content,
        verbose,
        `Created ${file.relativePath}`
      );
      created += 1;
    }

    return created;
  }

  private buildFileList(extensionName: string, extensionDescription: string): GeneratedFile[] {
    return [
      {
        relativePath: 'manifest.json',
        content: renderManifest(extensionName, extensionDescription),
      },
      {
        relativePath: 'popup/popup.html',
        content: renderPopupHtml(extensionName),
      },
      {
        relativePath: 'popup/popup.css',
        content: renderPopupCss(),
      },
      {
        relativePath: 'popup/popup.js',
        content: renderPopupJs(),
      },
      {
        relativePath: 'background/background.js',
        content: renderBackground(),
      },
      {
        relativePath: 'content/content.js',
        content: renderContentScript(),
      },
      {
        relativePath: 'options/options.html',
        content: renderOptionsHtml(extensionName),
      },
      {
        relativePath: 'options/options.js',
        content: renderOptionsJs(),
      },
      {
        relativePath: 'README.md',
        content: renderExtensionReadme(extensionName, extensionDescription),
      },
    ];
  }
}
