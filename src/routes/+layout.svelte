<script>
    import "../app.css";
    import '@fontsource-variable/josefin-sans';
    import { PrismicPreview } from '@prismicio/svelte/kit';
    import { page } from '$app/stores';
    import { repositoryName } from '$lib/prismicio';
    import Footer from '$lib/components/Footer.svelte';
    import Header from '$lib/components/Header.svelte';

    export let data;

    const defaultImage = "https://www.cronemberger.work/CrownSimple.webp";
</script>

<svelte:head>
    <title>{$page.data.title || "Crone Portfolio"}</title>

    {#if $page.data.meta_description}
        <meta name="description" content={$page.data.meta_description} />
        <meta property="og:description" content={$page.data.meta_description} />
    {/if}

    <meta property="og:type" content="website" />
    <meta
        property="og:title"
        content={$page.data.meta_title || $page.data.title || "Crone Portfolio"}
    />

    <meta property="og:image" content={$page.data.meta_image || defaultImage} />
    <meta property="og:image:width" content="1080" />
    <meta property="og:image:height" content="1080" />

    <meta name="twitter:card" content="summary" />
    <meta name="twitter:image" content={$page.data.meta_image || defaultImage} />
</svelte:head>

<Header settings={data.settings} />

<div class="relative overflow-x-hidden min-h-screen flex flex-col">

    <main class="relative z-10 flex-grow">
        <slot />
    </main>

    <div class="relative z-10">
        <Footer settings={data.settings} />
    </div>

    <div class="absolute inset-x-0 bottom-0 -z-30 h-80 bg-blue-950/80 blur-3xl md:h-80" />
    <div class="absolute inset-x-0 bottom-0 -z-30 h-72 bg-blue-950 md:h-64" />

    <div
        class="pointer-events-none fixed inset-0 -z-40 h-full w-full
        bg-[url('/noisetexture.jpg')] bg-repeat opacity-20 mix-blend-soft-light"
        style="background-size: 100px;" 
    />

    <div class="background-gradient fixed inset-0 -z-50" />
</div>

<PrismicPreview {repositoryName} />