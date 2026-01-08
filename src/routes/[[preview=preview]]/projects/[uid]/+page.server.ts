import { createClient } from '$lib/prismicio';

export async function load({ params, fetch, cookies, locals }) {
    const client = createClient({ fetch, cookies });

    // 1. Busca o projeto específico usando o idioma do sistema (Cookie ou Navegador)
    const page = await client.getByUID('projects', params.uid, { lang: locals.lang });

    return {
        page,
        title: page.data.title,
        meta_description: page.data.meta_description,
        meta_title: page.data.meta_title || page.data.title,
        meta_image: page.data.meta_image.url,
        lang: locals.lang
    };
}

export async function entries() {
    const client = createClient();

    // 2. Busca todos os projetos em todos os idiomas para gerar as rotas no build
    const pages = await client.getAllByType('projects', { lang: '*' });

    return pages.map((page) => {
        return { 
            uid: page.uid 
        };
    });
}