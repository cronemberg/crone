import { createClient } from '$lib/prismicio';

export async function load({ params, fetch, cookies, locals }) {
    const client = createClient({ fetch, cookies });

    // Adicionado o parâmetro lang vindo do seu hooks.server.ts
    const page = await client.getByUID('lportfolio', params.uid, { lang: locals.lang });

    return {
        page,
        title: page.data.title,
        meta_description: page.data.meta_description,
        meta_title: page.data.meta_title || page.data.title,
        meta_image: page.data.meta_image.url,
        lang: locals.lang // Útil para lógica de interface se necessário
    };
}

export async function entries() {
    const client = createClient();

    // lang: '*' garante que o Prismic retorne as versões de todos os idiomas configurados
    const pages = await client.getAllByType('lportfolio', { lang: '*' });

    return pages.map((page) => {
        return { 
            uid: page.uid
        };
    });
}