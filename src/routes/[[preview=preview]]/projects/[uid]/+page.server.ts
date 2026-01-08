import { createClient } from '$lib/prismicio';

export async function load({ fetch, cookies, locals }) {
    const client = createClient({ fetch, cookies });
    const lang = locals.lang || 'en-us';

    try {
        const page = await client.getByUID('page', 'home', { 
            lang,
            fetchLinks: [
                'projects.title', 
                'projects.hover_image',
                'projects.position'
            ] 
        });

        // Busca os projetos para alimentar a ContentList que está na Home
        const items = await client.getAllByType('projects', { lang });

        return {
            page,
            items, 
            title: page.data.meta_title || "Portfolio",
            meta_description: page.data.meta_description || "",
            meta_image: page.data.meta_image?.url || "",
            lang
        };
    } catch (e) {
        console.error("Erro no load da Home:", e);
        // Fallback para en-us
        const fallbackPage = await client.getByUID('page', 'home', { lang: 'en-us' });
        const fallbackItems = await client.getAllByType('projects', { lang: 'en-us' });
        return {
            page: fallbackPage,
            items: fallbackItems,
            lang: 'en-us'
        };
    }
}