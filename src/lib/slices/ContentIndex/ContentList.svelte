<script lang="ts">
    import {
        asImageSrc,
        isFilled,
        type ImageField,
        type KeyTextField
    } from '@prismicio/client';
    import { PrismicLink } from '@prismicio/svelte';
    import { gsap } from 'gsap';
    import type { Action } from 'svelte/action';
    import { onMount, onDestroy } from 'svelte';
    import { browser } from '$app/environment'; // IMPORTANTE: Para checar se estamos no navegador
    import IconArrow from '~icons/ic/baseline-arrow-outward';

    export let items: any[] = [];
    export let fallbackItemImage: ImageField;
    export let viewMoreText: KeyTextField = 'Read More';

    let lastMousePos = { x: 0, y: 0 };
    let currentIndex: number | null = null;
    
    // Iniciamos como false para evitar o atraso de "sumiço" no desktop, 
    // mas controlamos a lógica via CSS e onMount
    let isDesktop = false; 
    let hoverEl: HTMLDivElement | null = null;

    /* =========================
        SORT & IMAGES (Reativos)
    ========================= */
    $: sortedItems = [...items].sort((a, b) => {
        const posA = a.data?.position ? Number(a.data.position) : 0;
        const posB = b.data?.position ? Number(b.data.position) : 0;
        return posA - posB;
    });

    $: contentImages = sortedItems.map((item) => {
        const image = isFilled.image(item.data?.hover_image)
            ? item.data.hover_image
            : fallbackItemImage;
        return asImageSrc(image, { fit: 'crop', w: 320, h: 180, exp: -10 });
    });

    /* =========================
        HOVER LOGIC
    ========================= */
    const handleMouseMove = (e: MouseEvent) => {
        if (!isDesktop || currentIndex === null || !hoverEl) return;

        const mouseX = e.clientX;
        const mouseY = e.clientY;
        const speed = Math.abs(mouseX - lastMousePos.x);

        gsap.to(hoverEl, {
            x: mouseX - 112, // Centraliza o cursor na imagem (metade de 224px)
            y: mouseY - 63,  // Centraliza o cursor na imagem (metade de 126px)
            rotation: speed * 0.5 * (mouseX > lastMousePos.x ? 1 : -1),
            ease: 'power2.out',
            duration: 0.6
        });

        lastMousePos = { x: mouseX, y: mouseY };
    };

    const onMouseEnter = (index: number) => {
        if (!isDesktop) return;
        currentIndex = index;
        gsap.to(hoverEl, { opacity: 1, visibility: 'visible', duration: 0.3 });
    };

    const onMouseLeave = () => {
        currentIndex = null;
        gsap.to(hoverEl, { opacity: 0, duration: 0.2 });
    };

    /* =========================
        STAGGER ANIMATION
    ========================= */
    const onItemEnter: Action<HTMLElement, number> = (node, index) => {
        gsap.fromTo(node, { opacity: 0, y: 20 }, {
            opacity: 1, y: 0, duration: 0.8, delay: 0.1 + index * 0.1, ease: 'power3.out'
        });
    };

    onMount(() => {
        // Só executa no cliente
        const checkDesktop = () => isDesktop = window.innerWidth >= 768;
        checkDesktop();
        window.addEventListener('resize', checkDesktop);
        window.addEventListener('mousemove', handleMouseMove);
    });

    onDestroy(() => {
        if (browser) {
            window.removeEventListener('resize', () => {});
            window.removeEventListener('mousemove', handleMouseMove);
        }
    });
</script>

<ul on:mouseleave={onMouseLeave} class="relative grid w-full grid-cols-1 border-b border-b-slate-100/20">
    {#each sortedItems as post, index (post.id + index)}
        <li on:mouseenter={() => onMouseEnter(index)} class="content-list-item opacity-0" use:onItemEnter={index}>
            <PrismicLink document={post} class="flex flex-col gap-6 border-t border-t-slate-100/20 py-8 text-slate-200 hover:text-yellow-400 md:flex-row md:items-center">
                
                <div class="flex flex-col gap-2 overflow-hidden w-full">
                    <span class="text-2xl font-bold md:text-3xl break-words leading-tight">
                        {post.data.title || post.uid}
                    </span>

                    <div class="flex flex-wrap gap-2 text-yellow-500/80 w-full max-w-[calc(100vw-4rem)]">
                        {#if post.tags}
                            {#each post.tags as tag}
                                <span class="text-base font-bold whitespace-normal break-words md:text-lg">
                                    {tag}
                                </span>
                            {/each}
                        {/if}
                    </div>
                </div>

                <span class="flex items-center gap-2 text-lg font-medium md:ml-auto md:whitespace-nowrap">
                    {viewMoreText} <IconArrow />
                </span>
            </PrismicLink>
        </li>
    {/each}
</ul>

<div
    bind:this={hoverEl}
    class="pointer-events-none fixed left-0 top-0 z-50 h-[126px] w-[224px] rounded-lg bg-cover bg-center opacity-0 transition-opacity"
    class:hidden={!isDesktop}
    style:background-image={currentIndex !== null ? `url(${contentImages[currentIndex]})` : ''}
/>

<style>
    /* Esconde o elemento no mobile via CSS para garantir performance */
    @media (max-width: 767px) {
        .pointer-events-none { display: none !important; }
    }
</style>