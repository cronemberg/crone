import { createClient } from '$lib/prismicio';

export async function load({ fetch, cookies, locals }) {
    const client = createClient({ fetch, cookies });
    
    // Captura o idioma do sistema (configurado pelo seu switcher/hooks)
    const lang = locals.lang || 'en-us';

    // 1. Busca a página que contém a Slice (ex: portfólio geral)
    const page = await client.getSingle('lportfolio', { lang });

    // 2. Busca os ITENS da lista (os projetos) garantindo o idioma
    // Isso resolve o problema dos títulos em inglês nas listas
    const items = await client.getAllByType('projects', { lang });

    return {
        page,
        items, // Esta lista agora contém os títulos traduzidos
        title: page.data.meta_title || page.data.title,
        meta_description: page.data.meta_description,
        meta_image: page.data.meta_image?.url || "",
        lang
    };
}