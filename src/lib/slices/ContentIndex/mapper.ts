import type { Client, Content, SliceMapper } from '@prismicio/client';

type Context = any; 

const mapper: SliceMapper<
    Content.ContentIndexSlice,
    { 
        slice: Content.ContentIndexSlice; 
        items: (Content.LportfolioDocument | Content.ProjectsDocument)[] 
    },
    Context
> = async ({ slice, context }) => {
    // Busca o lang em qualquer nível que ele esteja
    const lang = context?.lang || context?.context?.lang || 'en-us';
    const client = context?.client || context?.context?.client;

    try {
        const rawType = (slice.primary.content_type || '').toLowerCase();
        const type = rawType.includes('project') ? 'projects' : 'lportfolio';

        if (!client) return { slice, items: [] };

        let items = await client.getAllByType(type, { lang });

        // Fallback apenas se realmente não houver nada
        if (items.length === 0 && lang !== 'en-us') {
            items = await client.getAllByType(type, { lang: 'en-us' });
        }

        return {
            slice,
            items: items as (Content.LportfolioDocument | Content.ProjectsDocument)[]
        };
    } catch (error) {
        return { slice, items: [] };
    }
};

export default mapper;