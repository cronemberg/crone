<script lang="ts">
    import { invalidateAll } from '$app/navigation';
    import { page } from '$app/stores';

    function setLanguage(lang: string) {
        document.cookie = `lang=${lang}; path=/; max-age=31536000; SameSite=Lax`;
        invalidateAll();
    }

    $: currentLang = $page.data.lang || 'en-us';
</script>

<div class="flex items-center gap-1 font-bold text-slate-900">
    <button 
        on:click={() => setLanguage('en-us')}
        class="rounded px-2 pt-2 pb-1 text-sm transition-colors {currentLang === 'en-us' ? 'bg-yellow-300' : 'hover:bg-slate-200'}"
    >
        <span class="leading-none">EN</span>
    </button>

    <span class="text-slate-300 text-xs">/</span>

    <button 
        on:click={() => setLanguage('pt-br')}
        class="rounded px-2 pt-2 pb-1 text-sm transition-colors {currentLang === 'pt-br' ? 'bg-yellow-300' : 'hover:bg-slate-200'}"
    >
        <span class="leading-none">PT</span>
    </button>
</div>