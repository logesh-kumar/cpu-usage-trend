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
        permissions: [
          'system.cpu',
          'system.memory',
          'system.storage',
          'storage',
        ],
      },
    }),
  ],
})
