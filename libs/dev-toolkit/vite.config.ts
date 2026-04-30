/// <reference types='vitest' />
import { nxCopyAssetsPlugin } from '@nx/vite/plugins/nx-copy-assets.plugin';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { defineConfig } from 'vite';

export default defineConfig(() => ({
  root: import.meta.dirname,
  cacheDir: '../../node_modules/.vite/libs/dev-toolkit',
  plugins: [ nxViteTsPaths(), nxCopyAssetsPlugin([ '*.md' ]) ],
  // Uncomment this if you are using workers.
  // worker: {
  //   plugins: () => [ nxViteTsPaths() ],
  // },
  test: {
    name: 'dev-toolkit',
    watch: false,
    globals: true,
    environment: 'node',
    include: [ '{src,tests}/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}' ],
    reporters: [ 'default' ],
    coverage: {
      reportsDirectory: '../../coverage/libs/dev-toolkit',
      provider: 'v8' as const
    }
  }
}));
