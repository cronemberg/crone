import { createClient } from '$lib/prismicio';

// O ": any" desativa a checagem chata do TypeScript temporariamente para esses parâmetros
export async function load({ fetch, cookies, params }: any) {
    const client = createClient({ fetch, cookies });
    
    // Lemos o idioma do cookie
    const lang = cookies.get('lang') || 'en-us';

    try {
        const page = await client.getByUID('lportfolio', params.uid, { lang });

        return {
            page,
            slices: page.data.slices, 
            title: page.data.meta_title || page.data.title,
            meta_description: page.data.meta_description,
            meta_image: page.data.meta_image?.url || "",
            lang 
        };
    } catch (e) {
        console.error(`Erro ao carregar portfolio [${params.uid}] em ${lang}:`, e);
        
        const page = await client.getByUID('lportfolio', params.uid, { lang: 'en-us' });

        return {
            page,
            slices: page.data.slices,
            title: page.data.meta_title || page.data.title,
            lang: 'en-us'
        };
    }
}