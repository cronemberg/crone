import { createClient } from '$lib/prismicio';
import { mapSliceZone } from '@prismicio/client';
import { mappers } from '$lib/slices/mappers';

export async function load({ fetch, cookies, params }) {
    const client = createClient({ fetch, cookies });
    
    // 1. Lemos o idioma do cookie
    const lang = cookies.get('lang') || 'en-us';

    try {
        // 2. Buscamos o documento do tipo 'lportfolio'
        const page = await client.getByUID('lportfolio', params.uid, { lang });

        // 3. O SEGREDO: Processamos os Slices e injetamos o 'lang' no context
        // Isso fará com que o ContentIndex e o Mapper saibam qual idioma buscar
        const slices = await mapSliceZone(page.data.slices, mappers, { 
            client, 
            context: { lang } 
        });

        return {
            page,
            slices, // Enviamos os slices processados para o Svelte
            title: page.data.meta_title || page.data.title,
            meta_description: page.data.meta_description,
            meta_image: page.data.meta_image?.url || "",
            lang 
        };
    } catch (e) {
        // Fallback de segurança caso o idioma selecionado falhe
        console.error(`Erro ao carregar portfolio [${params.uid}] em ${lang}:`, e);
        
        const page = await client.getByUID('lportfolio', params.uid, { lang: 'en-us' });
        const slices = await mapSliceZone(page.data.slices, mappers, { 
            client, 
            context: { lang: 'en-us' } 
        });

        return {
            page,
            slices,
            title: page.data.meta_title || page.data.title,
            lang: 'en-us'
        };
    }
}