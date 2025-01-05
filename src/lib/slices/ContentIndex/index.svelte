<script lang="ts">
	import Bounded from '$lib/components/Bounded.svelte';
	import Heading from '$lib/components/Heading.svelte';
	import { isFilled, type Content } from '@prismicio/client';
	import { PrismicRichText } from '@prismicio/svelte';
	import ContentList from './ContentList.svelte';
	import Hero2Index from '../Hero2/index.svelte';

	export let slice: Content.Hero2Slice;  // New prop for the Hero2 slice
	
	export let items: Content.LportfolioDocument[] | Content.ProjectsDocument[];
</script>

<Bounded data-slice-type={slice.slice_type} data-slice-variation={slice.variation}>
	<div class="flex flex-col md:flex-row items-center justify-between mb-8">
		
			<Heading size="xl" class="transform translate-y-24 md:translate-y-0">
			  {slice.primary.heading}
			</Heading>

		<div class="flex items-center -translate-y-24  md:-translate-y-6 md:-translate-x-1/4 lg:-translate-x-73 xl:-translate-x-80">
			<Hero2Index slice={slice} />
		  </div>
		
	  </div>
  
	{#if isFilled.richText(slice.primary.description)}
	  <div class="prose prose-xl prose-invert mb-10 -translate-y-5 flex flex-col md:flex-row items-center justify-between">
		<PrismicRichText field={slice.primary.description} />
	  </div>
	{/if}
  
	<div class="-translate-y-5">		
		<ContentList
		{items}
		fallbackItemImage={slice.primary.fallback_item_image}
		viewMoreText={slice.primary.view_more_text}
		/>
	</div>
  </Bounded>
  
  