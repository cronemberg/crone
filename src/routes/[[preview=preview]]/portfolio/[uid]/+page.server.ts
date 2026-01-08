import { createClient } from '$lib/prismicio';

export async function load({ fetch, cookies, params }) {
    const client = createClient({ fetch, cookies });
    
    // Detecta o idioma da URL ou usa o padrão
    const lang = params.lang || 'en-us';

    try {
        // Busca APENAS o documento solicitado pelo UID da URL
        const page = await client.getByUID('lportfolio', params.uid, { lang });

        return {
            page,
            title: page.data.meta_title || page.data.title,
            meta_description: page.data.meta_description,
            meta_image: page.data.meta_image?.url || "",
            lang
        };
    } catch (e) {
        // Se não existir no idioma atual, tenta o inglês como fallback
        const page = await client.getByUID('lportfolio', params.uid, { lang: 'en-us' });
        return {
            page,
            title: page.data.meta_title || page.data.title,
            lang: 'en-us'
        };
    }
}

export async function entries() {
    const client = createClient();
    const pages = await client.getAllByType('lportfolio', { lang: '*' });
    return pages.map((page) => ({ 
        uid: page.uid,
        lang: page.lang 
    }));
}