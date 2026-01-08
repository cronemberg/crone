import { asText, mapSliceZone } from '@prismicio/client';
import { createClient } from '$lib/prismicio';
import { mappers } from '$lib/slices/mappers';

export async function load({ params, fetch, cookies, locals }) {
    const client = createClient({ fetch, cookies });

    // 1. Busca a página pelo UID e pelo idioma detectado automaticamente
    const page = await client.getByUID('page', params.uid, { lang: locals.lang });

    // 2. Mapeia as fatias (Slices) para que os componentes recebam os dados traduzidos
    const slices = await mapSliceZone(page.data.slices, mappers, { client });
    
    return {
        slices,
        page, // Adicionado para facilitar o acesso a metadados no +layout.svelte
        title: asText(page.data.title),
        meta_description: page.data.meta_description,
        meta_title: page.data.meta_title,
        meta_image: page.data.meta_image.url,
        lang: locals.lang
    };
}

export async function entries() {
    const client = createClient();

    // 3. Garante que o SvelteKit conheça os UIDs de todos os idiomas para pré-renderização
    const pages = await client.getAllByType('page', { lang: '*' });

    return pages.map((page) => {
        return { 
            uid: page.uid 
        };
    });
}