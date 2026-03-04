<script lang="ts">
    import type { Content } from '@prismicio/client';
    import { PrismicRichText } from '@prismicio/svelte';
    import { asText } from '@prismicio/client';
    import { onMount } from 'svelte';

    export let slice: Content.TiktokSliceSlice;

    const videoId = slice.primary.tiktok_video_id;
    const username = slice.primary.tiktok_username || '@osunga';
    const fullVideoUrl = `https://www.tiktok.com/${username}/video/${videoId}`;

    onMount(() => {
        const script = document.createElement('script');
        script.src = "https://www.tiktok.com/embed.js";
        script.async = true;
        document.body.appendChild(script);
    });
</script>

<section class="tiktok-section py-8 px-4">
    <div class="flex flex-col md:flex-row items-start gap-10 max-w-6xl mx-auto">
        
        <div class="text-content flex-1 text-left order-2 md:order-1">
            {#if slice.primary.richtext_for_tiktok}
                <div class="prose prose-invert lg:prose-lg max-w-none">
                    <PrismicRichText field={slice.primary.richtext_for_tiktok} />
                </div>
            {/if}
        </div>

        <div class="video-column flex-shrink-0 order-1 md:order-2 self-center md:self-start w-[325px]">
            <div class="video-card shadow-2xl rounded-2xl overflow-hidden border border-blue-950 bg-blue-950">
                
                <div class="video-container bg-blue-950 overflow-hidden" style="height: 570px;">
                    <blockquote 
                        class="tiktok-embed" 
                        cite={fullVideoUrl} 
                        data-video-id={videoId}
                        style="max-width: 325px; min-width: 325px; height: 570px; margin: 0; padding: 0;"
                    >
                        <section class="flex items-center justify-center h-full">
                            <a target="_blank" href={fullVideoUrl} class="text-white font-sans no-underline hover:text-orange-500 py-10 block text-center w-full">
                                Loading TikTok...
                            </a>
                        </section>
                    </blockquote>
                </div>

                {#if slice.primary.caption_tiktok}
                    <div class="caption-container bg-blue-950 p-5 text-white border-t border-white/5">
                        <div class="caption-text text-sm italic leading-relaxed">
                            <PrismicRichText field={slice.primary.caption_tiktok} />
                        </div>
                    </div>
                {/if}
            </div>
        </div>
    </div>
</section>

<style>
    :global(.tiktok-embed) {
        margin: 0 !important;
        padding: 0 !important;
        width: 100% !important;
        height: 620px !important; /* Aumentamos a altura interna para compensar o corte e o scale */
        background-color: transparent !important;
    }

    :global(.tiktok-embed iframe) {
        width: 100% !important;
        height: 620px !important;
        border: none !important;
        display: block;
        
        /* CORTE E MINIATURA DOS BOTÕES: */
        margin-top: -2px; /* Corta o topo (equivalente aos -5% que você pediu) */
        transform-origin: top center; /* Garante que o encolhimento não crie buracos no topo */
    }

    .caption-text :global(p) {
        margin: 0;
    }
</style>