<script lang="ts">
    import { onMount } from 'svelte';
    import { fade } from 'svelte/transition'; 
    import type { Content } from '@prismicio/client';
    import Scene from './Scene.svelte';
    import gsap from 'gsap';
    import { page } from '$app/stores';

    export let slice: Content.HeroSlice;
    export let context: { lang: string };

    $: name_letters = slice.primary.the_name?.split("").map((char, index) => {
        const isBrowser = typeof Audio !== 'undefined';
        
        const mini = isBrowser ? new Audio('/sounds/minibutton.ogg') : null;
        if (mini) mini.volume = 0.5;

        const angry = isBrowser ? new Audio('/sounds/angry.ogg') : null;
        if (angry) angry.volume = 0.1;

        const rumble = isBrowser ? new Audio('/sounds/rumble.ogg') : null;
        if (rumble) { rumble.volume = 0; rumble.loop = false; }

        return {
            char,
            displayChar: char, 
            id: index,
            count: 0,
            isAngry: false,
            isIdle: false, 
            tearDirection: 0,
            sounds: { mini, angry, rumble }
        };
    }) ?? [];

    $: currentLang = context?.lang || $page.data.lang || 'en-us';
    $: isPt = currentLang === 'pt-br';
    $: interactiveLabel = isPt ? "Interativo" : "Interactive";

    let hasInteractedWithLetters = false;
    let idleTimeout: ReturnType<typeof setTimeout>;

    function resetIdleTimer() {
        hasInteractedWithLetters = true;
        clearTimeout(idleTimeout);
        idleTimeout = setTimeout(() => {
            hasInteractedWithLetters = false;
        }, 3000);
    }

    onMount(() => {
        const handleVisibilityChange = () => {
            if (document.hidden) {
                name_letters.forEach(l => {
                    if (l.sounds.rumble && !l.sounds.rumble.paused) {
                        gsap.killTweensOf(l.sounds.rumble); 
                        l.sounds.rumble.pause();
                    }
                });
            }
        };
        document.addEventListener("visibilitychange", handleVisibilityChange);

        const lettersElements = document.querySelectorAll(".name-animation");
        if (lettersElements.length > 0) {
            const tl = gsap.timeline();
            tl.fromTo(".name-animation", { x: -50, opacity: 0, rotate: -5 }, { x: 0, opacity: 1, rotate: 0, duration: 0.2, ease: 'back.out(33)', delay: 0.5, stagger: { each: 0.1, from: 'random' } });
            tl.fromTo(".job-title, .job-title2", { y: 20, opacity: 0, scale: 1.2 }, { y: 0, opacity: 1, duration: 1, scale: 1, ease: 'elastic.out(1,0.3)', stagger: 0.1 }, "-=0.5");
        }

        const idleInterval = setInterval(() => {
            if (document.hidden) return;

            if (name_letters.length > 0 && !hasInteractedWithLetters) {
                const randomIndex = Math.floor(Math.random() * name_letters.length);
                const letter = name_letters[randomIndex];

                if (!letter.isAngry && letter.count === 0) {
                    if (letter.sounds.rumble) {
                        letter.sounds.rumble.currentTime = 0;
                        letter.sounds.rumble.volume = 0.2; 
                        letter.sounds.rumble.play().catch(() => {});

                        gsap.to(letter.sounds.rumble, { 
                            volume: 0, 
                            duration: 1.2, 
                            ease: "power1.out",
                            delay: 0.1 
                        });
                    }

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

        return () => {
            clearInterval(idleInterval);
            clearTimeout(idleTimeout);
            document.removeEventListener("visibilitychange", handleVisibilityChange);
        };
    });

    function interactWithLetter(id: number, event: MouseEvent) {
        const index = name_letters.findIndex(l => l.id === id);
        if (index === -1 || name_letters[index].isAngry) return;

        const letter = name_letters[index];
        resetIdleTimer(); 

        if (letter.sounds.mini) {
            letter.sounds.mini.currentTime = 0;
            letter.sounds.mini.play().catch(() => {});
        }
        
        letter.count += 1;
        name_letters = [...name_letters]; 
        
        const currentCount = letter.count;

        if (letter.sounds.rumble) {
            if (letter.sounds.rumble.paused) letter.sounds.rumble.play().catch(() => {});
            gsap.to(letter.sounds.rumble, { volume: currentCount * 0.1, duration: 0.2, overwrite: true });
        }

        letter.isIdle = false;
        letter.tearDirection = (Math.random() - 0.5) * 80;

        const wrapper = event.currentTarget as HTMLElement;
        const charElement = wrapper.querySelector('.char-text') as HTMLElement;

        gsap.to(wrapper, { duration: 0.1, color: "#facc15" });

        if (currentCount < 4) {
            gsap.to(charElement, {
                scale: Math.random() > 0.5 ? 1.3 : 0.7,
                y: Math.random() > 0.5 ? -1 : 2,
                duration: 0.1,
                onComplete: () => {
                    if (!name_letters[index].isAngry) {
                        gsap.to(charElement, { scale: 1, y: 0, duration: 0.4 });
                    }
                }
            });
        } 
        else {
            const easterEggWords = ["hey!!", "stop!", "halt!", "mercy", "yield"];
            const targetWord = easterEggWords[index] || "stop!";

            name_letters.forEach(l => {
                l.isAngry = true;
                l.count = 4; 

                if (l.sounds.rumble) {
                    l.sounds.rumble.loop = true;
                    gsap.to(l.sounds.rumble, { volume: 0.25, duration: 0.3, overwrite: true });
                }
            });
            name_letters = [...name_letters];

            const allWrappers = document.querySelectorAll('.letter-interactive');
            gsap.to(allWrappers, { 
                color: "#ef4444", 
                duration: 0.3, 
                overwrite: true, 
                textShadow: "0 0 15px rgba(239, 68, 68, 0.8), 0 0 30px rgba(239, 68, 68, 0.4)" 
            });

            const allCharElements = document.querySelectorAll('.char-text');
            allCharElements.forEach((charEl, idx) => {
                const targetChar = targetWord[idx] !== undefined ? targetWord[idx] : name_letters[idx].char;

                const slotTl = gsap.timeline({ delay: idx * 0.1 }); 

                for (let i = 0; i < 3; i++) {
                    slotTl.to(charEl, {
                        y: -15, rotationX: 90, opacity: 0, duration: 0.06, ease: "power1.in",
                        onComplete: () => {
                            (charEl as HTMLElement).innerText = String.fromCharCode(97 + Math.floor(Math.random() * 26)); 
                        }
                    }).fromTo(charEl,
                        { y: 15, rotationX: -90, opacity: 0 },
                        { y: 0, rotationX: 0, opacity: 1, duration: 0.06, ease: "power1.out" }
                    );
                }

                slotTl.to(charEl, {
                    y: -15, rotationX: 90, opacity: 0, duration: 0.08, ease: "power1.in",
                    onComplete: () => {
                        name_letters[idx].displayChar = targetChar;
                        name_letters = [...name_letters];
                        (charEl as HTMLElement).innerText = targetChar === " " ? "\u00A0" : targetChar;
                    }
                }).fromTo(charEl,
                    { y: 15, rotationX: -90, opacity: 0 },
                    { y: 0, rotationX: 0, opacity: 1, duration: 0.3, ease: "back.out(2)" }
                );
            });

            setTimeout(() => {
                name_letters.forEach(l => {
                    const safeRumble = l.sounds.rumble;
                    
                    if (safeRumble) {
                        gsap.to(safeRumble, { 
                            volume: 0, 
                            duration: 0.2, 
                            onComplete: () => { 
                                safeRumble.pause(); 
                                safeRumble.loop = false; 
                            } 
                        });
                    }
                    if (l.sounds.angry) {
                        l.sounds.angry.currentTime = 0;
                        l.sounds.angry.play().catch(() => {});
                    }
                    l.isAngry = false;
                    l.count = 0;
                });
                name_letters = [...name_letters];

                gsap.to(allWrappers, { color: "inherit", textShadow: "none", duration: 0.5 });
                
                allCharElements.forEach((charEl, idx) => {
                    const originalChar = name_letters[idx].char;
                    gsap.to(charEl, {
                        y: -20, opacity: 0, rotationX: 90, scale: 1, duration: 0.2, delay: idx * 0.05, 
                        onComplete: () => {
                            name_letters[idx].displayChar = originalChar;
                            name_letters = [...name_letters];
                            (charEl as HTMLElement).innerText = originalChar === " " ? "\u00A0" : originalChar;

                            gsap.fromTo(charEl, 
                                { y: 20, opacity: 0, rotationX: -90, scale: 1 }, 
                                { y: 0, opacity: 1, rotationX: 0, duration: 0.3, ease: "back.out(2)" }
                            );
                        }
                    });
                });
            }, 5000);
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
            <div class="interactive-zone relative z-0 row-span-1 row-start-1 -my-10 aspect-[1/1] md:col-span-1 md:col-start-2 md:mt-0 w-full overflow-visible h-[500px] md:h-[800px] group transition-all duration-500 ease-out" class:hover-enabled={!hasInteractedWithLetters}>
                <Scene />
            </div>

            <div class="relative z-20 pointer-events-none col-start-1 md:row-start-1 flex flex-col items-center md:items-start">
                
                <h1 class="pointer-events-auto drop-shadow-[0_8px_16px_rgba(0,0,0,0.6)] -mb-4 md:-mb-7 text-[clamp(3rem,20vmin,13rem)] font-extrabold leading-none tracking-tighter text-slate-300 text-nowrap" aria-label={slice.primary.the_name}>
                    {#if name_letters.length}   
                        <span class="block">
                            {#each name_letters as letter (letter.id)}
                                <button 
                                    type="button"
                                    aria-label="Interactive letter {letter.char}"
                                    class="name-animation letter-interactive inline-block relative transition-all duration-500 reset-button"
                                    class:is-stunned={letter.isAngry}
                                    class:is-idle={letter.isIdle}
                                    class:vibe-1={letter.count === 1 && !letter.isAngry}
                                    class:vibe-2={letter.count === 2 && !letter.isAngry}
                                    class:vibe-3={letter.count === 3 && !letter.isAngry}
                                    style="opacity: 0; --tear-speed: {2 - (letter.count * 0.35)}s;"
                                    on:mousedown={(e) => interactWithLetter(letter.id, e)}
                                >
                                    <span class="char-text inline-block transform-gpu">
                                        {letter.displayChar === " " ? "\u00A0" : letter.displayChar}
                                    </span>

                                    {#if letter.count >= 2}
                                        <div class="absolute top-full left-0 w-full pointer-events-none overflow-visible flex justify-center">
                                            {#each Array(Math.floor(Math.random() * (letter.count - 1)) + 1) as _, i}
                                                <span 
                                                    class="tear text-blue-400" 
                                                    style="
                                                        --drift: {letter.tearDirection + (Math.random() * 10 - 5)}px; 
                                                        animation-delay: {Math.random() * 2}s;
                                                        left: {Math.random() * 100}%;
                                                    ">o</span>
                                            {/each}
                                        </div>
                                    {/if}
                                </button>
                            {/each}
                        </span>
                    {/if}
                </h1>
                
                <span class="pointer-events-auto job-title block bg-gradient-to-tr from-yellow-500 via-yellow-200 to-yellow-500 bg-clip-text text-transparent text-2xl font-bold tracking-[.1em] md:text-4xl opacity-0">
                    {slice.primary.tag_line}
                </span>

                <div class="mt-2 flex items-center">
                    <span class="pointer-events-auto job-title2 block bg-gradient-to-tr from-yellow-500 via-yellow-200 to-yellow-500 bg-clip-text text-transparent text-2xl font-bold tracking-[.1em] md:text-4xl opacity-0">
                        {slice.primary.tag_line_2}
                    </span>
                </div>
            </div>
        </div>
    </div>
</section>

<style>
    .name-animation { opacity: 0; }
    .interactive-zone, .letter-interactive { 
        cursor: url("https://api.iconify.design/ph:navigation-arrow-fill.svg?color=white") 2 2, pointer; 
        user-select: none; 
    }
    .interactive-zone { transition: transform 0.5s ease-out, filter 0.5s ease-out; }
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

    .tear { 
        position: absolute; 
        font-size: 0.15em; 
        opacity: 0; 
        top: 0; /* Garante que comece no topo do container */
        animation: fallDiagonal var(--tear-speed) infinite ease-in; 
    }
</style>