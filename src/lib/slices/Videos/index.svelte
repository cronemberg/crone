<script lang="ts">
	import type { Content } from '@prismicio/client';
	import { PrismicRichText } from '@prismicio/svelte';
	import { asText } from '@prismicio/client';

	export let slice: Content.VideosSlice;

	const videoId = slice.primary.youtube_video_id;
	const embedUrl = `https://www.youtube.com/embed/${videoId}`;
	const captionText = slice.primary.caption ? asText(slice.primary.caption) : 'YouTube Video';
</script>

<section 
	class="youtube-video-slice"
	data-slice-type={slice.slice_type} 
	data-slice-variation={slice.variation}
>
	<div class="video-container">
		<div class="video-wrapper">
			{#if slice.primary.thumbnail_override.url}
				<a href={`https://www.youtube.com/watch?v=${videoId}`} target="_blank" rel="noopener noreferrer">
					<img 
						src={slice.primary.thumbnail_override.url} 
						alt={captionText} 
					/>
				</a>
			{:else}
				<div class="responsive-iframe">
					<iframe 
						src={embedUrl} 
						title={captionText}
						frameborder="0"
						allowfullscreen
					></iframe>
				</div>
			{/if}
		</div>

		{#if slice.primary.caption}
			<div class="caption">
				<PrismicRichText field={slice.primary.caption} />
			</div>
		{/if}
	</div>
</section>

<style>
	.youtube-video-slice {
		text-align: center;
		margin: 2rem 0;
		padding: 0 1rem; /* Evita que o vídeo encoste nas bordas em telas menores */
	}

	.video-container {
		display: inline-block;
		text-align: left;
		width: 100%;  /* Faz o vídeo crescer proporcionalmente */
		max-width: 700px;  /* Aumenta o limite máximo */
		margin: 0 auto;
	}

	.video-wrapper iframe,
	.video-wrapper img {
		border-radius: 10px;
		display: block;
		width: 100%;  /* Ocupa o máximo de largura possível */
	}

	/* Mantém o aspect ratio correto */
	.responsive-iframe iframe {
		aspect-ratio: 16 / 9;
		width: 100%;
		height: auto;
	}

	.caption {
		margin-top: 0.5rem;
		font-style: italic;
		color: #555;
	}

	.caption :global(p) {
		margin: 0;
	}

	/* Vídeos verticais (como Shorts) */
	@media (max-width: 334px) {
		.responsive-iframe iframe {
			aspect-ratio: 9 / 16;
		}
	}
</style>
