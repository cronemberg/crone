import type { Client, Content, SliceMapper } from '@prismicio/client';
import type { ComponentProps } from 'svelte';

import ContentIndex from './index.svelte';

type Context = { client: Client<Content.AllDocumentTypes> };

const mapper: SliceMapper<
    Content.ContentIndexSlice,
    { slice: Content.ContentIndexSlice; items: Content.LportfolioDocument<string>[] | Content.ProjectsDocument<string>[] },
    Context
> = async ({ slice, context }) => {
    const { client } = context;

    try {
        const items =
            slice.primary.content_type === "Portfolio"
                ? await client.getAllByType('lportfolio')
                : await client.getAllByType('projects');

        return { slice, items };
    } catch (error) {
        console.error('Error fetching items:', error);
        return { slice, items: [] }; // Return an empty array or handle the error as needed
    }
};

export default mapper;