import { createClient } from '$lib/prismicio';

export async function load({ fetch, cookies }) {
    const client = createClient({ fetch, cookies });
    
    // 1. A FONTE DA VERDADE: Lemos o cookie 'lang'. 
    // Se não existir (primeiro acesso), usamos 'en-us'.
    const lang = cookies.get('lang') || 'en-us';

    let settings;

    try {
        // 2. BUSCA O MENU: Agora usando o idioma do Cookie
        settings = await client.getSingle('setttings', { lang });
    } catch (e) {
        // 3. FALLBACK: Se o menu em PT não existir, carrega em EN
        settings = await client.getSingle('setttings', { lang: 'en-us' });
    }

    return {
        settings,
        lang // Este 'lang' será herdado por TODAS as páginas (data.lang)
    };
}