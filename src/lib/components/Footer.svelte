<script lang="ts">
    import { type Content, isFilled } from '@prismicio/client';
	import { PrismicLink } from '@prismicio/svelte';
	import IconYoutube from '~icons/line-md/youtube-filled';
	import IconLinkedin from '~icons/fa-brands/linkedin';
	import IconGitHub from '~icons/fa-brands/github';
	import Bounded from './Bounded.svelte';
	

export let settings: Content.SetttingsDocument;
</script>


<Bounded as="footer" class="text-slate-600">
	<div class="cointaner mx-auto flex mt-20 flex-col items-center justify-between gap-6 py-8 sm:flex-row">
		<div class="name flex flex-col items-center justify-center gap-x-4 gap-y-2 sm:flex-row sm:justify-self">
            <a href="/" class="text-xl font-extrabold tracking-tighter text-slate-100 transition-color duration-150 hover:text-yellow-400" style="transform: translateY(-1px);">
                {settings.data.name}
            </a>
            <spam class="hidden text-5xl font-extralight leading-[0] text-slate-400 sm:inline" aria-hidden="true">/</spam>
            <p class="text-sm text-slate-300">© {new Date().getFullYear()} {settings.data.name}</p>
		</div>
		<nav class="navigation" aria-label="Footer Navigation">
			<ul class="flex items-center gap-1">
				{#each settings.data.nav_item as {link, label}, index}
					<li>
						<PrismicLink field={link} class="box px-3 py-1 tet-base font-bold text-slate-100 transition-colors duration-150 hover:text-yellow-400">{label}</PrismicLink>
					</li>
					{#if index < settings.data.nav_item.length -1}
					<span class="text-4xl font-thin leading-[0] text-slate-400" aria-hidden="true">
						/
					</span>
					{/if}
				{/each}
            </ul>
		</nav>
		<div class="socials inline-flex justify-center sm:justify-end items-center">
			{#if isFilled.link(settings.data.youtube_link)}
				<PrismicLink field={settings.data.youtube_link} class="p-2 text-3xl text-slate-300 transform trasition-all duration-150 hover:scale-125 hover:text-yellow-400" aria-label={settings.data.name + ' on Youtube'}>
					<IconYoutube/>
				</PrismicLink>
			{/if}
			{#if isFilled.link(settings.data.linkedin_link)}
				<PrismicLink field={settings.data.linkedin_link} class="p-2 text-2xl text-slate-300 transform trasition-all duration-150 hover:scale-125 hover:text-yellow-400" aria-label={settings.data.name + ' on Linkedin'}>
					<IconLinkedin/>
				</PrismicLink>
			{/if}
			{#if isFilled.link(settings.data.github_link)}
				<PrismicLink field={settings.data.github_link} class="p-2 text-2xl text-slate-300 transform trasition-all duration-150 hover:scale-125 hover:text-yellow-400" aria-label={settings.data.name + ' on Github'}>
					<IconGitHub/>
				</PrismicLink>
			{/if}
			
			
			
		</div>
	</div>
</Bounded>