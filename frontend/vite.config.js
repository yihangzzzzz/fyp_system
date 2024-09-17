const { defineConfig } = require('vite');
const react = require('@vitejs/plugin-react');
// const commonjs = require('vite-plugin-commonjs');

// https://vitejs.dev/config/
// module.exports = defineConfig({
//   plugins: [react([
//     'src/main.js', 
//   ])],
// })
module.exports = defineConfig({
  plugins: [react([

  ])],
  build: {
    rollupOptions: {
      output: {
        // format: 'iife', // This is important for non-module environments
      },
    },
  },
});