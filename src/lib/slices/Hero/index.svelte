<script lang="ts">
    import { onMount } from 'svelte';
    import { fade } from 'svelte/transition'; 
    import type { Content } from '@prismicio/client';
    import Scene from './Scene.svelte';
    import gsap from 'gsap';
    import { page } from '$app/stores';

    export let slice: Content.HeroSlice;

    // 1. Recebe o contexto enviado pelo SliceZone
    export let context: { lang: string };

    $: name_letters = slice.primary.the_name?.split("") ?? [];

    // 2. Lógica reativa: Se o contexto mudar, o label muda instantaneamente
    // O fallback é o dado da página ou en-us
    $: currentLang = context?.lang || $page.data.lang || 'en-us';
    $: isPt = currentLang === 'pt-br';
    $: interactiveLabel = isPt ? "Interativo" : "Interactive";

    let hasInteracted = false;

    onMount(() => {
        const tl = gsap.timeline();

        tl.fromTo(".name-animation", 
            { x: -100, opacity: 0, rotate: -10 },
            { 
                x: 0, 
                opacity: 1, 
                rotate: 0, 
                ease: 'elastic.out(1,0.3)', 
                delay: 0.5, 
                stagger: { each: .1, from: 'random' } 
            }
        );

        tl.fromTo(".job-title, .job-title2",
            { y: 20, opacity: 0, scale: 1.2 },
            { 
                y: 0, 
                opacity: 1, 
                duration: 1, 
                scale: 1, 
                ease: 'elastic.out(1,0.3)', 
                stagger: 0.1 
            },
            "-=0.5"
        );

        tl.fromTo(".interactive-exclusive",
            { x: 30, opacity: 0 },
            { 
                x: 0, 
                opacity: 1, 
                duration: 1, 
                ease: 'power2.out' 
            },
            "-=0.8"
        );
    });

    function handleInteraction() {
        hasInteracted = true;
    }
</script>

<section data-slice-type={slice.slice_type} data-slice-variation={slice.variation} class="px-4 md:px-6">
    <div class="mx-auto w-full max-w-7xl">
        <div class="grid min-h-[65vh] grid-cols-1 items-center md:grid-cols-2">
            
            <div 
                on:mousedown={handleInteraction} 
                on:touchstart={handleInteraction}
                role="presentation"
                class="relative z-10 row-span-1 row-start-1 -my-10 aspect-[1/1] md:col-span-1 md:col-start-2 md:mt-0 w-full overflow-visible h-[500px] md:h-[800px]"
            >
                <Scene />
            </div>

            <div class="relative col-start-1 md:row-start-1 flex flex-col items-center md:items-start">
                <h1 class="-mb-4 md:-mb-7 text-[clamp(3rem,20vmin,13rem)] font-extrabold leading-none tracking-tighter text-center md:text-left text-nowrap" aria-label={slice.primary.the_name}>
                    {#if name_letters.length}   
                        <span class="block text-slate-300">
                            {#each name_letters as letter}
                                <span class="name-animation inline-block opacity-0">{letter}</span>
                            {/each}
                        </span>
                    {/if}
                </h1>
                
                <span class="job-title block bg-gradient-to-tr from-yellow-500 via-yellow-200 to-yellow-500 bg-clip-text text-transparent text-2xl font-bold tracking-[.1em] md:text-4xl opacity-0">
                    {slice.primary.tag_line}
                </span>

                <div class="mt-2 flex items-center">
                    <span class="job-title2 block bg-gradient-to-tr from-yellow-500 via-yellow-200 to-yellow-500 bg-clip-text text-transparent text-2xl font-bold tracking-[.1em] md:text-4xl opacity-0">
                        {slice.primary.tag_line_2}
                    </span>

                    {#if !hasInteracted}
                        <div 
                            transition:fade={{ duration: 600 }} 
                            class="interactive-exclusive opacity-0 absolute flex flex-col md:flex-row items-center gap-2 pointer-events-none whitespace-nowrap
                                -top-2 left-0 right-0 justify-center
                                md:top-1/2 md:-translate-y-1/2 md:left-full md:right-auto md:justify-start md:translate-x-10 md:mt-4"
                        >
                            <span class="text-orange-400 text-sm font-bold uppercase tracking-widest animate-pulse">
                                {interactiveLabel}
                            </span>
                        </div>
                    {/if}
                </div>
            </div>
        </div>
    </div>
</section>