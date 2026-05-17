import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { viteStaticCopy } from 'vite-plugin-static-copy'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(), 
    viteStaticCopy({
    targets: [
      {
        src: 'index.html', // 只留 index.html 即可
        dest: '' 
      }
    ],
  })],
  build: {
    rollupOptions: {
      input: {
        content: 'src/main.js', // Build `main.js` as the content script
        background: 'src/background/background.js', // Add `background.js` as another entry point
      },
      output: {
        assetFileNames:'[name][extname]',
        entryFileNames: (chunkInfo) => {
          // Dynamically name files based on their entry point
          if (chunkInfo.name === 'content') {
            return 'main.js'; // Output content script as `main.js`
          }
          if (chunkInfo.name === 'background') {
            return 'background/background.js'; // Output background script into `background/`
          }
          // return '[name].js'; // Default naming for other files
        },
      },
      commonjsOptions: {
        include: [/node_modules/], // Include dependencies in the bundle
        format: 'iife',
      },
      external: []
    },
  },

})
