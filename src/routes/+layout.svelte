<script>
	import "../app.css";
	import '@fontsource-variable/josefin-sans';
	import { PrismicPreview } from '@prismicio/svelte/kit';
	import { page } from '$app/stores';
	import { repositoryName } from '$lib/prismicio';
	import Footer from '$lib/components/Footer.svelte';
	import Header from '$lib/components/Header.svelte';

	export let data;

	const defaultImage = "https://crone.vercel.app/CrownSimple.webp";
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

<!-- HEADER fica fora, sem transform -->
<Header settings={data.settings} />

<!-- WRAPPER RAIZ (ESSENCIAL) -->
<div class="relative overflow-x-hidden min-h-screen">

	<main class="relative z-10">
		<slot />
	</main>

	<!-- BACKGROUNDS SEMPRE DENTRO DO WRAPPER -->
	<div class="background-gradient absolute inset-0 -z-50 max-h-screen" />

	<div
		class="pointer-events-none absolute inset-0 -z-40 h-full
		bg-[url('/noisetexture.jpg')] opacity-20 mix-blend-soft-light"
	/>
</div>

<Footer settings={data.settings} />

<PrismicPreview {repositoryName} />
