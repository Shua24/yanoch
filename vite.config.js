import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
  root: 'src/Yanoch.Web',
  publicDir: 'wwwroot',
  build: {
    outDir: 'wwwroot',
    emptyOutDir: false,
    lib: {
      entry: path.resolve(__dirname, 'src/Yanoch.Web/wwwroot/js/tiptap-editor.src.js'),
      formats: ['es'],
      fileName: 'tiptap-editor'
    },
    rollupOptions: {
      external: [],
      treeshake: false,
      output: {
        entryFileNames: 'js/tiptap-editor.js',
        chunkFileNames: 'js/[name]-[hash].js',
        assetFileNames: 'css/[name]-[hash].[ext]'
      }
    }
  }
})
