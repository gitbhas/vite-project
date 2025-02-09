const { defineConfig } = require('vite')
const react = require('@vitejs/plugin-react')
const svgr = require('vite-plugin-svgr')

module.exports = defineConfig({
  plugins: [react(), svgr()],
  build: {
    outDir: 'dist'
  }
})