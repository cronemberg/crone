import { asText } from '@prismicio/client';
import { createClient } from '$lib/prismicio';

export async function load({ fetch, cookies, locals }) {
    const client = createClient({ fetch, cookies });
    let page;

    try {
        // 1. Tenta carregar a página no idioma detectado pelo Hook (ex: pt-br)
        page = await client.getByUID('page', 'home', { lang: locals.lang });
    } catch (e) {
        // 2. Se falhar (erro 500/No documents), tenta carregar no idioma Master (en-us)
        // Isso garante que o site abra mesmo que a tradução falhe
        page = await client.getByUID('page', 'home', { lang: 'en-us' });
    }

    // 3. Verificação extra para evitar erro de "data is undefined" se o UID 'home' sumir do Prismic
    if (!page) {
        return {
            title: "Crone Portfolio",
            meta_description: ""
        };
    }

    return {
        page,
        // Usamos encadeamento opcional (?.) para evitar quebras se algum campo meta estiver vazio
        title: asText(page.data.title) || "Crone Portfolio",
        meta_description: page.data.meta_description || "",
        meta_title: page.data.meta_title || asText(page.data.title),
        meta_image: page.data.meta_image?.url || "",
        lang: page.lang // Retorna o idioma real que foi encontrado (pt-br ou en-us)
    };
}

export function entries() {
    return [{}];
}