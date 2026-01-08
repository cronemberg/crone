import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
    let lang = event.cookies.get('lang');

    if (!lang) {
        const acceptLanguage = event.request.headers.get('accept-language');
        lang = acceptLanguage?.includes('pt') ? 'pt-br' : 'en-us';
    }

    // Garante que o locals.lang seja sempre uma string válida
    event.locals.lang = lang || 'en-us';

    return await resolve(event);
};