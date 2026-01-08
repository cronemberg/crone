import { asText } from '@prismicio/client';
import { createClient } from '$lib/prismicio';

export async function load({ fetch, cookies, locals }) {
    const client = createClient({ fetch, cookies });
    
    // 1. Pegamos o idioma que o botão/switcher enviou
    const requestedLang = locals.lang || 'en-us';
    let page;

    try {
        // 2. Tentativa obrigatória no idioma solicitado
        // Adicionamos fetchLinks para garantir que as listas vinculadas também tentem o idioma
        page = await client.getByUID('page', 'home', { 
            lang: requestedLang,
            fetchLinks: ['projects.title', 'projects.description']
        });
    } catch (e) {
        // 3. Só caímos no Inglês se o documento realmente não existir em PT
        // Mas note que não mudamos o requestedLang aqui para não quebrar o Switcher
        console.error(`Erro ao carregar idioma ${requestedLang}, tentando fallback...`);
        page = await client.getByUID('page', 'home', { lang: 'en-us' });
    }

    if (!page) {
        return {
            title: "Crone Portfolio",
            meta_description: "",
            lang: requestedLang // Mantém o estado do botão
        };
    }

    return {
        page,
        title: asText(page.data.title) || "Crone Portfolio",
        meta_description: page.data.meta_description || "",
        meta_title: page.data.meta_title || asText(page.data.title),
        meta_image: page.data.meta_image?.url || "",
        // O SEGREDO ESTÁ AQUI: 
        // Retornamos o idioma que o usuário CLICOU, 
        // para que os NavLinks e o resto do site acompanhem o botão.
        lang: requestedLang 
    };
}

export function entries() {
    return [{}];
}