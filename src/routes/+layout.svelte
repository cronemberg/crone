<script>
	import "../app.css";
	import '@fontsource-variable/josefin-sans';
	import { PrismicPreview } from '@prismicio/svelte/kit';
	import { page } from '$app/stores';
	import { repositoryName } from '$lib/prismicio';
	import Footer from "$lib/components/Footer.svelte";
	import Header from "$lib/components/Header.svelte";

	export let data;
</script>

<svelte:head>
	<title>{$page.data.title}</title>
	{#if $page.data.meta_description}
		<meta name="description" content={$page.data.meta_description} />
	{/if}
	{#if $page.data.meta_title}
		<meta name="og:title" content={$page.data.meta_title} />
	{/if}
	{#if $page.data.meta_image}
		<meta name="og:image" content={$page.data.meta_image} />
		<meta name="twitter:card" content="summary_large_image" />
	{/if}
</svelte:head>

<Header settings={data.settings}/>

<main>
	<slot />
</main>
<div class="background-gradient absolute inset-0 -z-50 max-h-screen"></div>
<div class="pointer-events-none absolute inset-0 -z-40 h-full bg-[url('/noisetexture.jpg')] opacity-10 mix-blend-soft-light"></div>
<!--<div class="absolute inset-4 bg-indigo-950 -z-30 opacity-50"></div><!-- Use a darker shade -->

<Footer settings={data.settings}/>

<PrismicPreview {repositoryName}/>
