<script lang="ts">
	import type { Content } from '@prismicio/client';
	import Scene from './Scene.svelte';

	export let slice: Content.Hero2Slice;

</script>

<section data-slice-type={slice.slice_type} data-slice-variation={slice.variation} class="px-4 md:px-6">
	<div class="mx-auto w-full max-w-7xl">
	  <div class="grid min-h-[1vh] grid-cols-1 items-center md:grid-cols-1 lg:grid-cols-3">
		<div class="relative z-10 row-span-1 row-start-1 -my-10 aspect-[1/1] md:col-span-1 md:col-start-2 md:mt-0 w-full overflow-visible h-[160px] sm:h-[170px] md:h-[170px]">
		  <Scene />
		</div>
	  </div>
	</div>
  </section>
  
	