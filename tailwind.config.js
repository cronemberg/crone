import { defineConfig } from 'tailwindcss';
import typography from '@tailwindcss/typography';

export default defineConfig({
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {},
  },
  plugins: [],
});