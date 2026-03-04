<script lang="ts">
    import type { Content } from '@prismicio/client';
    import { fade } from 'svelte/transition';
    import { page } from '$app/stores';
    import Scene from './Scene.svelte';

    export let slice: Content.Hero2Slice;

    let hasInteracted = false;

    $: currentLang = $page.data.lang || 'en-us';
    $: isPt = currentLang === 'pt-br';
    $: interactiveLabel = isPt ? "Interativo" : "Interactive";

    function handleInteraction() {
        hasInteracted = true;
    }
</script>

<section 
    data-slice-type={slice.slice_type} 
    data-slice-variation={slice.variation} 
    class="px-4 md:px-6"
>
    <div class="mx-auto w-full max-w-7xl">
        <div class="grid min-h-[1vh] grid-cols-1 items-center md:grid-cols-1 lg:grid-cols-3">
            <div 
                on:mousedown={handleInteraction} 
                on:touchstart={handleInteraction}
                role="presentation"
                class="interactive-zone relative z-10 row-span-1 row-start-1 -my-10 aspect-[1/1] md:col-span-1 md:col-start-2 md:mt-0 w-full overflow-visible h-[160px] sm:h-[170px] md:h-[170px]"
				class:hover-enabled={!hasInteracted}
            >
                <Scene />

                {#if !hasInteracted}
                    <div 
                        transition:fade={{ duration: 400 }} 
                        class="absolute inset-0 flex items-center justify-center pointer-events-none"
                    >
                        <span class="text-orange-400 text-xs font-bold uppercase tracking-[.4em] animate-pulse whitespace-nowrap translate-y-16">
                            {interactiveLabel}
                        </span>
                    </div>
                {/if}
            </div>
        </div>
    </div>
</section>

<style>
    .interactive-zone {
        cursor: url("https://api.iconify.design/ph:navigation-arrow-fill.svg?color=white") 2 2, pointer;
        user-select: none;
    }

    .interactive-zone:active {
        cursor: url("https://api.iconify.design/ph:navigation-arrow-duotone.svg?color=white") 2 2, pointer;
    }

    .interactive-zone {
        transition: transform 0.5s ease-out, filter 0.5s ease-out;
    }
    
    /* Aumenta a escala e o brilho APENAS enquanto não houver interação */
    .hover-enabled:hover { 
        transform: scale(1.02); 
        filter: brightness(1.15) drop-shadow(0px 10px 20px rgba(0, 0, 0, 0.2)); 
    }

    /* Animação de pulso para o estilo minimalista */
    .animate-pulse {
        animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }

    @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: .4; }
    }
</style>