<script lang="ts">
    import { SliceZone } from '@prismicio/svelte';
    import type { Content } from '@prismicio/client';

    import { components } from '$lib/slices';
    import { formatDate } from '$lib/formatDate';

    import Bounded from './Bounded.svelte';
    import Heading from './Heading.svelte';

    export let page: Content.LportfolioDocument | Content.ProjectsDocument;
    
    // 1. Recebe o idioma que vem do +page.svelte (e do servidor)
    export let lang: string = 'en-us';

    // 2. Passa o 'lang' para o formatDate para traduzir a data do topo
    $: formattedDate = formatDate(page.data.date, lang);
</script>

<Bounded tag="article">
    <div class="rounded-2xl border-2 border-slate-800 border-opacity-40 bg-slate-950 bg-opacity-40 px-4 py-10 md:px-8 md:py-20">
        <Heading tag="h1">{page.data.title}</Heading>
        <div class="flex gap-4 text-yellow-400">
            {#each page.tags as tag}
                <span class="text-xl font-bold">
                    {tag}
                </span>
            {/each}
        </div>
        <p class="mt-8 border-b border-slate-600 text-xl font-medium text-slate-300">{formattedDate}</p>

        <div class="prose prose-lg prose-invert mt-12 w-full max-w-none md:mt-20">
            <SliceZone slices={page.data.slices} {components} context={{ lang }} />
        </div>
    </div>
</Bounded>