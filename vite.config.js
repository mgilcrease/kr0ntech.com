import { defineConfig } from 'vite';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: 'src/components/animated-graph.js',
      formats: ['es'],
    },
		manifest: true,
    rollupOptions: {
      external: /^lit/,
			input: {
				main: resolve(__dirname, 'index.html'),
			}
    },
  },
})
