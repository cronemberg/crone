<script lang="ts">
	import { onMount } from 'svelte';
	import type { Content } from '@prismicio/client';
	import Scene from './Scene.svelte';
	import gsap from 'gsap';

	export let slice: Content.HeroSlice;

	const name_letters = slice.primary.the_name?.split("") ?? ""

	onMount(()=>{
		const tl = gsap.timeline();

		tl.fromTo(".name-animation", 
			{
				x:-100,
				opacity:0,
				rotate:-10,
			},
			{
				x:0,
				opacity:1,
				rotate:0,
				ease: 'elastic.out(1,0.3)',
				transformOrigin: 'left top',
				delay:0.5,
				stagger:{
					each:.1,
					from:'random'
				}
			}
		)
		tl.fromTo(".job-title",
			{
				y:20,
				opacity:0,
				scale:1.2,
			},
			{
				y:0,
				opacity:1,
				duration:1,
				scale:1,
				ease: 'elastic.out(1,0.3)'
			}
		)
		tl.fromTo(".job-title2",
			{
				y:20,
				opacity:0,
				scale:1.2,
			},
			{
				y:0,
				opacity:1,
				duration:1,
				scale:1,
				ease: 'elastic.out(1,0.3)'
			}
		)
	});

</script>

<section data-slice-type={slice.slice_type} data-slice-variation={slice.variation} class="px-4 md:px-6">
	<div class="mx-auto w-full max-w-7xl">
		<div class="grid min-h-[65vh] grid-cols-1 items-center md:grid-cols-2">
			<div class="relative z-10 row-span-1 row-start-1 -my-10 aspect-[1/1] md:col-span-1 md:col-start-2 md:mt-0 w-full overflow-visible h-[500px] md:h-[800px]">
				<Scene />
			</div>
			<div class="col-start-1 md:rowstart-1">
				<h1 class="-mb-4 md:-mb-7 text-[clamp(3rem,20vmin,13rem)] font-extrabold leading-none tracking-tighter text-nowrap" aria-label={slice.primary.the_name}>
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
			<span class="job-title2 block bg-gradient-to-tr from-yellow-500 via-yellow-200 to-yellow-500 bg-clip-text text-transparent text-2xl font-bold tracking-[.1em] md:text-4xl opacity-0">
				{slice.primary.tag_line_2}
			</span>
			</div>
		</div>
	</div>
	</section>
	