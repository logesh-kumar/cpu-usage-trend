import { defineConfig } from 'vite'
import webExtension from '@vite-preset/web-extension'

export default defineConfig({
  plugins: [
    webExtension({
      manifest: {
        manifest_version: 3,
        name: 'CPU Trend Monitor',
        version: '1.0.0',
        description: 'Monitor system status like CPU',
        offline_enabled: true,
        background: {
          service_worker: 'src/background.ts',
        },        
        content_scripts: [
          {
            matches: ['<all_urls>'],
            js: ['src/content.ts'],
            run_at: 'document_start',
          },
        ],
        permissions: [
          'system.cpu',          
          'system.storage',
          'storage',
        ],
      },
    }),
  ],
})
