<script lang="ts">
    import {
        asImageSrc,
        isFilled,
        type Content,
        type ImageField,
        type KeyTextField
    } from '@prismicio/client';
    import { PrismicLink } from '@prismicio/svelte';
    import { gsap } from 'gsap';
    import type { Action } from 'svelte/action';
    import IconArrow from '~icons/ic/baseline-arrow-outward';

    // Recebe os itens traduzidos do servidor
    export let items: any[] = []; 
    export let fallbackItemImage: ImageField;
    export let viewMoreText: KeyTextField = 'Read More';
    let lastMousePos = { x: 0, y: 0 };
    let currentIndex: number | undefined;

    // Ordenação segura
    $: sortedItems = [...items].sort((a, b) => {
        const posA = a.data?.position ? Number(a.data.position) : 0;
        const posB = b.data?.position ? Number(b.data.position) : 0;
        return posA - posB;
    });

    // Mapeamento de imagens para o hover (Desktop)
    $: contentImages = sortedItems.map((item) => {
        const image = isFilled.image(item.data?.hover_image) ? item.data.hover_image : fallbackItemImage;
        return asImageSrc(image, {
            fit: 'crop',
            w: 320,
            h: 180,
            exp: -10
        });
    });

    /**
     * Ação de entrada em Cascata (Stagger)
     * 100% via código, sem ScrollTrigger para evitar erros de navegação.
     */
    const onItemEnter: Action<HTMLElement, number> = (node, index) => {
        const isMobile = window.innerWidth < 768;
        
        // No mobile, usamos um delay inicial maior e uma cascata mais lenta
        const initialDelay = isMobile ? 0.4 : 0.2;
        const staggerDelay = isMobile ? 0.3 : 0.25;

        gsap.fromTo(
            node,
            { 
                opacity: 0, 
                y: 20 
            },
            {
                opacity: 1,
                y: 0,
                duration: 1,
                delay: initialDelay + (index * staggerDelay), 
                ease: 'power3.out'
            }
        );
    };

    const handleMouseMove = (e: MouseEvent) => {
        const mousePos = { x: e.pageX, y: e.pageY };
        const speed = Math.sqrt(Math.pow(mousePos.x - lastMousePos.x, 2));

        const maxY = window.scrollY + window.innerHeight - 350;
        const maxX = window.innerWidth - 250;

        gsap.to('.hover-reveal', {
            left: gsap.utils.clamp(0, maxX, mousePos.x - 200),
            top: gsap.utils.clamp(0, maxY, mousePos.y - 400),
            rotation: speed * 0.5 * (mousePos.x > lastMousePos.x ? 1 : -1),
            ease: 'back.out(2)',
            duration: 1
        });

        gsap.to('.hover-reveal', {
            opacity: currentIndex === undefined ? 0 : 1,
            visibility: 'visible',
            ease: 'power3.out',
            duration: 0.6
        });

        lastMousePos = mousePos;
    };

    const onMouseEnter = (index: number) => { currentIndex = index; };
    const onMouseLeave = () => { currentIndex = undefined; };
</script>

<svelte:window on:mousemove={handleMouseMove} />

<ul on:mouseleave={onMouseLeave} class="grid border-b border-b-slate-100/20">
    {#each sortedItems as post, index (post.id + index)}
        <li
            on:mouseenter={() => onMouseEnter(index)}
            class="content-list-item opacity-0" 
            use:onItemEnter={index}
        >
            <PrismicLink
                document={post}
                class="flex flex-col justify-between border-t border-t-slate-100/20 py-10 text-slate-200 md:flex-row transition-colors hover:text-yellow-400"
            >
                <div class="flex flex-col">
                    <span class="text-3xl font-bold">{post.data.title || post.uid}</span>
                    <div class="flex gap-3 text-yellow-500/80">
                        {#if post.tags}
                            {#each post.tags as tag}
                                <span class="text-lg font-bold">{tag}</span>
                            {/each}
                        {/if}
                    </div>
                </div>
                <span class="ml-auto flex items-center gap-2 text-xl font-medium md:ml-0">
                    {viewMoreText} <IconArrow />
                </span>
            </PrismicLink>
        </li>
    {/each}
</ul>

<div
    class="hover-reveal pointer-events-none absolute left-0 top-0 -z-10 h-[126px] w-[224px] rounded-lg bg-cover bg-center opacity-0 transition-[background] duration-300"
    style={currentIndex === undefined ? '' : `background-image: url(${contentImages[currentIndex]})`}
/>