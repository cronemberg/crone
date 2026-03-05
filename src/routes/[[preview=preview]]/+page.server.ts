import { asText } from '@prismicio/client';
import { mapSliceZone } from '@prismicio/client';
import { createClient } from '$lib/prismicio';
import { mappers } from '$lib/slices/mappers';

export async function load({ fetch, cookies }: any) {
    const client = createClient({ fetch, cookies });
    
    // 1. Pega o idioma do cookie
    const lang = cookies.get('lang') || 'en-us';

    try {
        // 2. Busca a página 'crone' no idioma do cookie
        const page = await client.getByUID('page', 'crone', { lang });

        // 3. O AJUSTE: O mapSliceZone espera que o objeto de contexto 
        // contenha as propriedades diretamente.
        const slices = await mapSliceZone(page.data.slices, mappers as any, { 
            client, 
            lang // ✅ Tem que estar aqui, no mesmo nível do client
        });

        return {
            page,
            slices,
            title: asText(page.data.title) || "Crone",
            lang 
        };
    } catch (e) {
        console.error(`Erro no Load: Buscando fallback para en-us.`);
        
        const page = await client.getByUID('page', 'crone', { lang: 'en-us' });
        const slices = await mapSliceZone(page.data.slices, mappers as any, { 
            client, 
            lang: 'en-us' 
        });
        
        return {
            page,
            slices,
            lang: 'en-us'
        };
    }
}