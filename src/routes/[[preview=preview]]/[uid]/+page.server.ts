import { asText, mapSliceZone } from '@prismicio/client';
import { createClient } from '$lib/prismicio';
import { mappers } from '$lib/slices/mappers';

export async function load({ params, fetch, cookies }) {
    const client = createClient({ fetch, cookies });

    // 1. Pegamos o idioma direto do Cookie (onde seu botão grava 'pt-br' ou 'en-us')
    const lang = cookies.get('lang') || 'en-us';

    try {
        // 2. Busca a página pelo UID e pelo idioma real
        const page = await client.getByUID('page', params.uid, { lang });

        // 3. Mapeia as fatias passando o 'lang' para o contexto (fundamental para a lista!)
        const slices = await mapSliceZone(page.data.slices, mappers as any, { 
            client, 
            lang // <-- Agora o Mapper vai saber que é pt-br!
        });
        
        return {
            slices,
            page,
            title: asText(page.data.title),
            meta_description: page.data.meta_description,
            meta_title: page.data.meta_title,
            meta_image: page.data.meta_image?.url || "",
            lang
        };
    } catch (e) {
        // Fallback para inglês se o UID não existir no idioma solicitado
        const page = await client.getByUID('page', params.uid, { lang: 'en-us' });
        const slices = await mapSliceZone(page.data.slices, mappers as any, { 
            client, 
            lang: 'en-us' 
        });

        return {
            slices,
            page,
            lang: 'en-us'
        };
    }
}

export async function entries() {
    const client = createClient();
    const pages = await client.getAllByType('page', { lang: '*' });

    return pages.map((page) => { 
        return {
            uid: page.uid 
        };
    });
}