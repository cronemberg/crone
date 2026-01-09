import { createClient } from '$lib/prismicio';

export async function load({ fetch, cookies, params }) {
    const client = createClient({ fetch, cookies });
    
    // MUDANÇA: Agora ele pega o idioma que o seu botão salvou no cookie
    const lang = cookies.get('lang') || 'en-us';

    try {
        const page = await client.getByUID('projects', params.uid, { lang });

        return {
            page,
            title: page.data.title,
            meta_description: page.data.meta_description,
            meta_image: page.data.meta_image?.url || "",
            lang // Retornamos para o Svelte formatar a data
        };
    } catch (e) {
        // Fallback para inglês se a tradução não existir
        const page = await client.getByUID('projects', params.uid, { lang: 'en-us' });
        return {
            page,
            title: page.data.title,
            lang: 'en-us'
        };
    }
}

export async function entries() {
    const client = createClient();
    const pages = await client.getAllByType('projects', { lang: '*' });
    return pages.map((page) => ({ 
        uid: page.uid, 
        lang: page.lang 
    }));
}