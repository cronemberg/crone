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

    // Geramos as URLs dos cursores usando o padrão do Phosphor Icons (SVG puro e nítido)
    // O preenchimento (fill) é branco com contorno fino para destacar no fundo escuro
    const cursorOpen = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 256 256'%3E%3Cpath fill='white' d='M218.42 83.5a12.06 12.06 0 0 0-11.23-7.5h-31.19V52a12 12 0 0 0-22.42-6.1l-24 48a12 12 0 1 0 21.46 10.74l12.96-25.92V112a12 12 0 0 0 24 0V88h17.15l-33.15 66.3a12 12 0 0 0 21.46 10.74l43.2-86.41a12 12 0 0 0 1.76-5.13Z'/%3E%3C/svg%3E") 16 16, auto`;
    
    const cursorClosed = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 256 256'%3E%3Cpath fill='white' d='M104 144a12 12 0 0 1-12 12H40a12 12 0 0 1 0-24h52a12 12 0 0 1 12 12Zm112-12h-52a12 12 0 0 0 0 24h52a12 12 0 0 0 0-24Zm-100-36a12 12 0 0 0 12-12V44a12 12 0 0 0-24 0v40a12 12 0 0 0 12 12Zm44 0a12 12 0 0 0 12-12V44a12 12 0 0 0-24 0v40a12 12 0 0 0 12 12Z'/%3E%3C/svg%3E") 16 16, auto`;
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
            >
                <Scene />

                {#if !hasInteracted}
                    <div 
                        transition:fade={{ duration: 400 }} 
                        class="absolute inset-0 flex items-center justify-center pointer-events-none"
                    >
                        <span class="inline-block bg-orange-500/90 text-white text-[10px] font-black uppercase tracking-[.3em] px-3 pt-[8px] pb-[5px] leading-[0] rounded-full animate-bounce shadow-xl border border-white/20 whitespace-nowrap translate-y-16">
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
        /* ph:navigation-arrow-fill - Ponta no canto superior esquerdo (2 2) */
        cursor: url("https://api.iconify.design/ph:navigation-arrow-fill.svg?color=white") 2 2, pointer;
    }

    .interactive-zone:active {
        /* ph:navigation-arrow-duotone - Mantém o hotspot no mesmo lugar ao clicar */
        cursor: url("https://api.iconify.design/ph:navigation-arrow-duotone.svg?color=white") 2 2, pointer;
    }

    /* Animações do Badge */
    .animate-bounce {
        animation: bounce 4s infinite;
    }

    @keyframes bounce {
        0%, 100% { 
            transform: translateY(57px); 
            animation-timing-function: cubic-bezier(0.2, 0, 0.6, 1); 
        }
        50% { 
            transform: translateY(60px); 
            animation-timing-function: cubic-bezier(0, 0, 0.2, 1); 
        }
    }
</style>