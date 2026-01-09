import { asText, mapSliceZone } from '@prismicio/client';
import { createClient } from '$lib/prismicio';
import { mappers } from '$lib/slices/mappers';

export async function load({ fetch, cookies }) {
    const client = createClient({ fetch, cookies });
    
    // 1. Lê o idioma do cookie
    const lang = cookies.get('lang') || 'en-us';

    try {
        // 2. BUSCA PELO UID CORRETO: 'crone'
        const page = await client.getByUID('page', 'crone', { lang });

        // 3. Mapeia os slices passando o idioma no contexto
        const slices = await mapSliceZone(page.data.slices, mappers, { 
            client, 
            context: { lang } 
        });

        return {
            page,
            slices,
            title: asText(page.data.title) || "Crone",
            lang 
        };
    } catch (e) {
        console.error(`Erro ao buscar UID 'crone' em ${lang}. Verifique se a página está publicada.`);
        
        // Fallback para inglês caso a tradução falhe
        const page = await client.getByUID('page', 'crone', { lang: 'en-us' });
        const slices = await mapSliceZone(page.data.slices, mappers, { 
            client, 
            context: { lang: 'en-us' } 
        });
        
        return {
            page,
            slices,
            lang: 'en-us'
        };
    }
}