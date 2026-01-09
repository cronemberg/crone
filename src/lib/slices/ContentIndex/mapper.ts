import type { Client, Content, SliceMapper } from '@prismicio/client';

type Context = { 
    client: Client<Content.AllDocumentTypes>;
    lang: string; 
};

const mapper: SliceMapper<
    Content.ContentIndexSlice,
    { 
        slice: Content.ContentIndexSlice; 
        items: Content.LportfolioDocument<string>[] | Content.ProjectsDocument<string>[] 
    },
    Context
> = async ({ slice, context }) => {
    const { client, lang } = context;

    try {
        const type =
            slice.primary.content_type === 'Portfolio'
                ? 'lportfolio'
                : 'projects';

        // 1️⃣ Tentamos no idioma selecionado
        let items = await client.getAllByType(type, {
            lang
        });

        // 2️⃣ Se não existir tradução, fallback explícito
        if (!items.length && lang !== 'en-us') {
            items = await client.getAllByType(type, {
                lang: 'en-us'
            });
        }

        return {
            slice,
            items
        };
    } catch (error) {
        console.error('Erro no Mapper do ContentIndex:', error);
        return {
            slice,
            items: []
        };
    }
};

export default mapper;
