<script lang="ts">
    import type { Content } from '@prismicio/client';
    import Scene from './Scene.svelte';

    export let slice: any;
</script>

<section 
    data-slice-type={slice.slice_type} 
    data-slice-variation={slice.variation} 
    class="px-4 md:px-6"
>
    <div class="mx-auto w-full max-w-7xl">
        <div class="grid min-h-[1vh] grid-cols-1 items-center md:grid-cols-1 lg:grid-cols-3">
            <div 
                role="presentation"
                class="interactive-zone relative z-10 row-span-1 row-start-1 -my-10 aspect-[1/1] md:col-span-1 md:col-start-2 md:mt-0 w-full overflow-visible h-[160px] sm:h-[170px] md:h-[170px]"
            >
                <Scene />
            </div>
        </div>
    </div>
</section>

<style>
    .interactive-zone {
        /* Mantive o cursor customizado para o usuário saber que ainda pode clicar */
        cursor: url("https://api.iconify.design/ph:navigation-arrow-fill.svg?color=white") 2 2, pointer;
        user-select: none;
        transition: transform 0.5s ease-out, filter 0.5s ease-out;
    }

    .interactive-zone:active {
        cursor: url("https://api.iconify.design/ph:navigation-arrow-duotone.svg?color=white") 2 2, pointer;
    }

    /* O efeito de hover agora fica sempre ativo, dando feedback visual ao passar o mouse */
    .interactive-zone:hover { 
        transform: scale(1.02); 
        filter: brightness(1.15) drop-shadow(0px 10px 20px rgba(0, 0, 0, 0.2)); 
    }
</style>