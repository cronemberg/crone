<script lang="ts">
    import { onMount } from 'svelte';
    import { fade } from 'svelte/transition'; 
    import type { Content } from '@prismicio/client';
    import Scene from './Scene.svelte';
    import gsap from 'gsap';
    import { page } from '$app/stores';

    export let slice: Content.HeroSlice;
    export let context: { lang: string };

    // 1. Estrutura de dados: Lágrimas no 2º clique, Fúria no 4º
    $: name_letters = slice.primary.the_name?.split("").map((char, index) => ({
        char,
        id: index,
        clicked: false,
        count: 0,
        isAngry: false,
        randomScale: 1,
        tearDirection: 0
    })) ?? [];

    $: currentLang = context?.lang || $page.data.lang || 'en-us';
    $: isPt = currentLang === 'pt-br';
    $: interactiveLabel = isPt ? "Interativo" : "Interactive";

    let hasInteracted = false;

    onMount(() => {
        const tl = gsap.timeline();

        // Animação das letras
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

        // Animação dos cargos
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

        // Animação do aviso Interactive (Exatamente como o antigo)
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

    function interactWithLetter(id: number) {
        const index = name_letters.findIndex(l => l.id === id);
        if (index === -1 || name_letters[index].isAngry) return;

        hasInteracted = true; 
        name_letters[index].count += 1;
        name_letters[index].randomScale = Math.random() > 0.5 ? 1.4 : 0.6;
        name_letters[index].tearDirection = (Math.random() - 0.5) * 80; 
        name_letters[index].clicked = true;

        if (name_letters[index].count >= 4) {
            name_letters[index].isAngry = true;
            setTimeout(() => {
                const i = name_letters.findIndex(l => l.id === id);
                if (i !== -1) {
                    name_letters[i].isAngry = false;
                    name_letters[i].count = 0;
                    name_letters = [...name_letters];
                }
            }, 5000);
        }

        name_letters = [...name_letters];

        setTimeout(() => {
            const i = name_letters.findIndex(l => l.id === id);
            if (i !== -1) {
                name_letters[i].clicked = false;
                name_letters = [...name_letters];
            }
        }, 800);
    }
</script>

<section data-slice-type={slice.slice_type} data-slice-variation={slice.variation} class="px-4 md:px-6">
    <div class="mx-auto w-full max-w-7xl">
        <div class="grid min-h-[65vh] grid-cols-1 items-center md:grid-cols-2">
            
            <div 
                on:mousedown={() => hasInteracted = true} 
                on:touchstart={() => hasInteracted = true}
                role="presentation"
                class="interactive-zone relative z-10 row-span-1 row-start-1 -my-10 aspect-[1/1] md:col-span-1 md:col-start-2 md:mt-0 w-full overflow-visible h-[500px] md:h-[800px]"
            >
                <Scene />
            </div>

            <div class="relative col-start-1 md:row-start-1 flex flex-col items-center md:items-start">
                <h1 class="-mb-4 md:-mb-7 text-[clamp(3rem,20vmin,13rem)] font-extrabold leading-none tracking-tighter text-slate-300 text-nowrap" aria-label={slice.primary.the_name}>
                    {#if name_letters.length}   
                        <span class="block">
                            {#each name_letters as letter (letter.id)}
                                <span 
                                    class="name-animation letter-interactive inline-block relative transition-all duration-300"
                                    class:is-stunned={letter.isAngry}
                                    style="
                                        transform: {letter.clicked ? `scale(${letter.randomScale}) translateY(${letter.randomScale > 1 ? '-30px' : '20px'})` : 'scale(1) translateY(0)'}; 
                                        color: {letter.isAngry ? '#ef4444' : (letter.clicked ? '#facc15' : 'inherit')};
                                        text-shadow: {letter.isAngry ? '0 0 20px rgba(239, 68, 68, 0.8)' : 'none'};
                                        --tear-speed: {2 - (letter.count * 0.35)}s;
                                    "
                                    on:mousedown={() => interactWithLetter(letter.id)}
                                >
                                    {letter.char === " " ? "\u00A0" : letter.char}

                                    {#if letter.count >= 2}
                                        <div class="absolute top-full left-0 w-full pointer-events-none overflow-visible flex justify-center">
                                            <span class="tear text-blue-400" style="--drift: {letter.tearDirection}px; animation-delay: 0s;">o</span>
                                            {#if letter.count >= 3}
                                                <span class="tear text-blue-400" style="--drift: {letter.tearDirection * -1}px; animation-delay: 0.2s;">o</span>
                                            {/if}
                                        </div>
                                    {/if}
                                </span>
                            {/each}
                        </span>
                    {/if}
                </h1>
                
                <span class="job-title block bg-gradient-to-tr from-yellow-500 via-yellow-200 to-yellow-500 bg-clip-text text-transparent text-2xl font-bold tracking-[.1em] md:text-4xl opacity-0">
                    {slice.primary.tag_line}
                </span>

                <div class="mt-2 flex items-center relative">
                    <span class="job-title2 block bg-gradient-to-tr from-yellow-500 via-yellow-200 to-yellow-500 bg-clip-text text-transparent text-2xl font-bold tracking-[.1em] md:text-4xl opacity-0">
                        {slice.primary.tag_line_2}
                    </span>

                    {#if !hasInteracted}
                        <div 
                            transition:fade={{ duration: 600 }} 
                            class="interactive-exclusive opacity-0 absolute flex flex-col md:flex-row items-center gap-2 pointer-events-none whitespace-nowrap
                                /* Mobile: Centralizado acima das profissões */
                                -top-2 left-0 right-0 justify-center
                                /* Desktop: Alinhado à direita do Nome e profissões */
                                md:-top-32 md:left-full md:right-auto md:justify-start md:translate-x-10"
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

<style>
    .interactive-zone, .letter-interactive {
        cursor: url("https://api.iconify.design/ph:navigation-arrow-fill.svg?color=white") 2 2, pointer;
        user-select: none;
    }

    .tear {
        position: absolute;
        font-size: 0.15em;
        opacity: 0;
        animation: fallDiagonal var(--tear-speed) infinite ease-in;
    }

    @keyframes fallDiagonal {
        0% { transform: translate(0, 0); opacity: 0; }
        20% { opacity: 1; }
        100% { transform: translate(var(--drift), 120px); opacity: 0; }
    }

    .is-stunned {
        cursor: not-allowed !important;
        animation: shake 0.2s infinite;
    }

    @keyframes shake {
        0% { transform: translateX(0); }
        25% { transform: translateX(-3px) rotate(-1deg); }
        75% { transform: translateX(3px) rotate(1deg); }
        100% { transform: translateX(0); }
    }
</style>