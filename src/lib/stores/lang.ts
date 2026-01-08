import { writable } from 'svelte/store';

// Define o idioma inicial (ex: inglês)
export const currentLang = writable('en-us');