import { sveltekit } from '@sveltejs/vite-plugin-svelte';
import { defineConfig } from 'vite';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

export default defineConfig({
  plugins: [sveltekit(), tailwindcss()],
  css: {
    postcss: {
      plugins: [tailwindcss(), autoprefixer()]
    }
  }
});
