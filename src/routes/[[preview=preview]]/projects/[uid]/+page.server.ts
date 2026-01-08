import { createClient } from '$lib/prismicio';

export async function load({ fetch, cookies, params }) {
    const client = createClient({ fetch, cookies });
    const lang = params.lang || 'en-us';

    try {
        const page = await client.getByUID('projects', params.uid, { lang });

        return {
            page,
            title: page.data.title,
            meta_description: page.data.meta_description,
            meta_image: page.data.meta_image?.url || "",
            lang
        };
    } catch (e) {
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