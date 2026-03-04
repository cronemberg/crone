<script lang="ts">
    import { onMount } from 'svelte';
    import { fade } from 'svelte/transition'; 
    import type { Content } from '@prismicio/client';
    import Scene from './Scene.svelte';
    import gsap from 'gsap';
    import { page } from '$app/stores';

    export let slice: Content.HeroSlice;
    export let context: { lang: string };

    $: name_letters = slice.primary.the_name?.split("").map((char, index) => ({
        char,
        id: index,
        count: 0,
        isAngry: false,
        isIdle: false, 
        tearDirection: 0
    })) ?? [];

    $: currentLang = context?.lang || $page.data.lang || 'en-us';
    $: isPt = currentLang === 'pt-br';
    $: interactiveLabel = isPt ? "Interativo" : "Interactive";

    let hasInteractedWithLetters = false; // Nova flag específica para as letras

    onMount(() => {
        const tl = gsap.timeline();
        tl.fromTo(".name-animation", 
            { x: -50, opacity: 0, rotate: -5 }, // Diminuí um pouco a distância e rotação inicial para ser mais veloz
            { 
                x: 0, 
                opacity: 1, 
                rotate: 0, 
                duration: 0.2, // Duração fixa e rápida para o movimento da letra
                ease: 'back.out(33)', // Dá um micro-pulo rápido e trava, sem ficar balançando
                delay: 0.5, 
                stagger: { each: 0.1, from: 'random' } // De 0.2 para 0.04: entram quase como uma metralhadora
            }
        );

        tl.fromTo(".job-title, .job-title2",
            { y: 20, opacity: 0, scale: 1.2 },
            { y: 0, opacity: 1, duration: 1, scale: 1, ease: 'elastic.out(1,0.3)', stagger: 0.1 },
            "-=0.5"
        );

        const idleInterval = setInterval(() => {
            // CORREÇÃO: O Idle agora só para quando interagir com as LETRAS
            if (name_letters.length > 0 && !hasInteractedWithLetters) {
                const randomIndex = Math.floor(Math.random() * name_letters.length);
                if (!name_letters[randomIndex].isAngry && name_letters[randomIndex].count === 0) {
                    name_letters[randomIndex].isIdle = true;
                    name_letters = [...name_letters];
                    setTimeout(() => {
                        const i = name_letters.findIndex(l => l.id === randomIndex);
                        if (i !== -1) {
                            name_letters[i].isIdle = false;
                            name_letters = [...name_letters];
                        }
                    }, 1200); 
                }
            }
        }, 3500); 
        return () => clearInterval(idleInterval);
    });

    function interactWithLetter(id: number, event: MouseEvent) {
        const index = name_letters.findIndex(l => l.id === id);
        if (index === -1 || name_letters[index].isAngry) return;

        hasInteractedWithLetters = true; // Agora o Idle para aqui
        name_letters[index].isIdle = false;
        name_letters[index].count += 1;
        name_letters[index].tearDirection = (Math.random() - 0.5) * 80; 

        // Modificado para pegar os elementos corretos
        const wrapper = event.currentTarget as HTMLElement;
        const charElement = wrapper.querySelector('.char-text') as HTMLElement; // Alvo do scale

        const newScale = Math.random() > 0.5 ? 1.3 : 0.7;
        const jumpY = newScale > 1 ? -1 : 2;

        // O scale e o y vão APENAS para o texto, não para o wrapper (que segura as lágrimas)
        gsap.to(charElement, {
            scale: newScale,
            y: jumpY,
            duration: 0.1,
            onComplete: () => {
                const currentLetter = name_letters.find(l => l.id === id);
                if (currentLetter && !currentLetter.isAngry) {
                    gsap.to(charElement, { scale: 1, y: 0, duration: 0.4 });
                }
            }
        });

        // A cor e a vibração continuam no wrapper inteiro
        gsap.to(wrapper, {
            duration: 0.1,
            color: "#facc15"
            // REMOVIDO: O onComplete que voltava a cor para inherit
        });

        if (name_letters[index].count >= 4) {
            name_letters[index].isAngry = true;
            name_letters = [...name_letters];
            
            // ADICIONADO: Brilho (Glow) de raiva emanando
            gsap.to(wrapper, { 
                color: "#ef4444", 
                duration: 0.3, 
                overwrite: true,
                textShadow: "0 0 15px rgba(239, 68, 68, 0.8), 0 0 30px rgba(239, 68, 68, 0.4)"
            });

            // Reseta o texto imediatamente se ele estiver escalado do último clique
            gsap.to(charElement, { scale: 1, y: 0, duration: 0.3 });

            setTimeout(() => {
                const i = name_letters.findIndex(l => l.id === id);
                if (i !== -1) {
                    name_letters[i].isAngry = false;
                    name_letters[i].count = 0;
                    name_letters = [...name_letters];
                    gsap.to(wrapper, { color: "inherit", textShadow: "none", duration: 0.5 });
                }
            }, 5000);
        } else {
            name_letters = [...name_letters];
        }
    }
</script>

<section data-slice-type={slice.slice_type} data-slice-variation={slice.variation} class="px-4 md:px-6 relative overflow-visible">
    <div class="mx-auto w-full max-w-7xl relative">
        {#if !hasInteractedWithLetters}
            <div transition:fade={{ duration: 600 }} class="interactive-exclusive opacity-0 absolute inset-0 z-50 pointer-events-none flex items-center justify-center">
                <span class="text-orange-400 text-xs font-bold uppercase tracking-[.4em] animate-pulse translate-y-[20rem] md:translate-y-0">{interactiveLabel}</span>
            </div>
        {/if}

        <div class="grid min-h-[65vh] grid-cols-1 items-center md:grid-cols-2">
            <div class="interactive-zone relative z-10 row-span-1 row-start-1 -my-10 aspect-[1/1] md:col-span-1 md:col-start-2 md:mt-0 w-full overflow-visible h-[500px] md:h-[800px] group transition-all duration-500 ease-out" class:hover-enabled={!hasInteractedWithLetters}>
                <Scene />
                {#if !hasInteractedWithLetters}<div class="absolute inset-0 rounded-full bg-yellow-500/0 transition-all duration-700 pointer-events-none blur-3xl group-hover:bg-yellow-500/5" />{/if}
            </div>

            <div class="relative col-start-1 md:row-start-1 flex flex-col items-center md:items-start">
                <h1 class="-mb-4 md:-mb-7 text-[clamp(3rem,20vmin,13rem)] font-extrabold leading-none tracking-tighter text-slate-300 text-nowrap" aria-label={slice.primary.the_name}>
                    {#if name_letters.length}   
                        <span class="block">
                            {#each name_letters as letter (letter.id)}
                                <span 
                                    class="name-animation letter-interactive inline-block relative transition-all duration-500"
                                    class:is-stunned={letter.isAngry}
                                    class:is-idle={letter.isIdle}
                                    class:vibe-1={letter.count === 1 && !letter.isAngry}
                                    class:vibe-2={letter.count === 2 && !letter.isAngry}
                                    class:vibe-3={letter.count === 3 && !letter.isAngry}
                                    style="opacity: 0; display: inline-block; --tear-speed: {2 - (letter.count * 0.35)}s;"
                                    on:mousedown={(e) => interactWithLetter(letter.id, e)}
                                >
                                    <span class="char-text inline-block">
                                        {letter.char === " " ? "\u00A0" : letter.char}
                                    </span>

                                    {#if letter.count >= 2}
                                        <div class="absolute top-full left-0 w-full pointer-events-none overflow-visible flex justify-center">
                                            <span class="tear text-blue-400" style="--drift: {letter.tearDirection}px; animation-delay: 0s;">o</span>
                                            {#if letter.count >= 3}<span class="tear text-blue-400" style="--drift: {letter.tearDirection * -1}px; animation-delay: 0.2s;">o</span>{/if}
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

                <div class="mt-2 flex items-center">
                    <span class="job-title2 block bg-gradient-to-tr from-yellow-500 via-yellow-200 to-yellow-500 bg-clip-text text-transparent text-2xl font-bold tracking-[.1em] md:text-4xl opacity-0">
                        {slice.primary.tag_line_2}
                    </span>
                </div>
            </div>
        </div>
    </div>
</section>

<style>
    .name-animation { 
        opacity: 0; 
    }

        .interactive-zone, .letter-interactive { 
        cursor: url("https://api.iconify.design/ph:navigation-arrow-fill.svg?color=white") 2 2, pointer; 
        user-select: none; 
    }
        .interactive-zone:active, .letter-interactive:active {
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

    .vibe-1 { animation: v1 0.1s infinite; }
    .vibe-2 { animation: v2 0.1s infinite; }
    .vibe-3 { animation: v3 0.08s infinite; }

    @keyframes v1 { 0%, 100% { translate: 0; } 50% { translate: 0 -1px; } }
    @keyframes v2 { 0%, 100% { translate: 0; } 50% { translate: 0 -2px; } }
    @keyframes v3 { 0%, 100% { translate: 0; } 25% { translate: 2px -2px; } 75% { translate: -2px 2px; } }

    .is-idle { 
        animation: idle-shake 0.4s; 
        color: #94a3b8 !important; 
        opacity: 0.9 !important; 
        transition: opacity 0.1s ease, color 0.1s ease !important;
    }
    
    .letter-interactive {
        transition: opacity 0.8s ease, color 0.8s ease, transform 0.3s ease;
    }

    @keyframes idle-shake {
        0%, 100% { transform: rotate(0); }
        25% { transform: rotate(1.5deg); }
        75% { transform: rotate(-1.5deg); }
    }

    .is-stunned { animation: shake-angry 0.1s infinite !important; }
    @keyframes shake-angry {
        0% { transform: translateX(0) rotate(0deg); }
        25% { transform: translateX(-5px) rotate(-2deg); }
        75% { transform: translateX(5px) rotate(2deg); }
        100% { transform: translateX(0) rotate(0deg); }
    }

    .tear { position: absolute; font-size: 0.15em; opacity: 0; animation: fallDiagonal var(--tear-speed) infinite ease-in; }
    @keyframes fallDiagonal {
        0% { transform: translate(0, 0); opacity: 0; }
        20% { opacity: 1; }
        100% { transform: translate(var(--drift), 120px); opacity: 0; }
    }
</style>