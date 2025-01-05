<script lang="ts">
	import type { Content } from '@prismicio/client';
	import { PrismicRichText } from '@prismicio/svelte';

	export let slice: Content.RichTextSlice;
</script>

<div class="">
	<PrismicRichText
		field={slice.primary.content}
	/>
</div>

