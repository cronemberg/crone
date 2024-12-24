import type { Client, Content, SliceMapper } from "@prismicio/client";
import type { ComponentProps } from "svelte";

import ContentIndex from './index.svelte'

type Context = { client: Client<Content.AllDocumentTypes>}

const mapper: SliceMapper<Content.ContentIndexSlice, ComponentProps<ContentIndex>, Context> = async ({slice,context}) => {
    const {client} = context;
    const items = slice.primary.content_type == "Portfolio" ? await client.getAllByType('lportfolio'): await client.getAllByType('projects')

    return {slice, items}
};

export default mapper