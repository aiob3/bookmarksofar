export function renderManifest(extensionName: string, extensionDescription: string): string {
  return JSON.stringify(
    {
      manifest_version: 3,
      name: extensionName,
      version: '1.0.0',
      description: extensionDescription,
      permissions: ['bookmarks', 'storage', 'activeTab', 'tabs'],
      host_permissions: ['<all_urls>'],
      action: {
        default_popup: 'popup/popup.html',
        default_title: extensionName,
        default_icon: {
          16: 'icons/icon16.png',
          32: 'icons/icon32.png',
          48: 'icons/icon48.png',
          128: 'icons/icon128.png'
        }
      },
      background: {
        service_worker: 'background/background.js',
        type: 'module'
      },
      content_scripts: [
        {
          matches: ['<all_urls>'],
          js: ['content/content.js'],
          run_at: 'document_idle'
        }
      ],
      options_ui: {
        page: 'options/options.html',
        open_in_tab: true
      },
      icons: {
        16: 'icons/icon16.png',
        32: 'icons/icon32.png',
        48: 'icons/icon48.png',
        128: 'icons/icon128.png'
      },
      web_accessible_resources: [
        {
          resources: ['popup/*', 'options/*'],
          matches: ['<all_urls>']
        }
      ]
    },
    null,
    2
  );
}
