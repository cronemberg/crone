<script>
    import { SliceZone } from '@prismicio/svelte';
    import { components } from '$lib/slices';

    export let data;

    // Criamos a reatividade para o idioma que veio do servidor
    $: lang = data.lang || 'en-us';
</script>

<SliceZone slices={data.page.data.slices} {components} context={{ lang }} />