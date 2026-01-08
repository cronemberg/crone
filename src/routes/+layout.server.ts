import { createClient } from '$lib/prismicio';

export async function load({ fetch, cookies, locals }) {
    const client = createClient({ fetch, cookies });
    let settings;

    try {
        // Tenta buscar o menu no idioma detectado (Cookie ou Navegador)
        settings = await client.getSingle('setttings', { lang: locals.lang });
    } catch (e) {
        // Se a tradução não existir, carrega o menu original em inglês
        settings = await client.getSingle('setttings', { lang: 'en-us' });
    }

    return {
        settings,
        lang: locals.lang // Passa o idioma para o resto do site
    };
}