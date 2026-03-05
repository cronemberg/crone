<script lang="ts">
    import { onMount } from 'svelte';
    import Bounded from '$lib/components/Bounded.svelte';
    import Button from '$lib/components/Button.svelte';
    import Heading from '$lib/components/Heading.svelte';
    import type { Content } from '@prismicio/client';
    import { PrismicRichText } from '@prismicio/svelte';
    import Avatar from './Avatar.svelte';
    import gsap from 'gsap';

    import IconDownload from '~icons/line-md/downloading-loop'; 
    import IconEmail from '~icons/line-md/email';

    export let slice: Content.BiographySlice;

// --- Lógica do Mini-Game do Avatar ---
    let totalDamage = 0;
    const maxHealth = 500; // O "HP" necessário para ativar o Enrage

    let isEnraged = false;
    let particles: { id: number; x: number; y: number; text: string; color: string; scale: number }[] = [];
    let particleIdCounter = 0;
    let comboTimeout: ReturnType<typeof setTimeout>;

    // Áudios
    let sounds: { mini: HTMLAudioElement | null; angry: HTMLAudioElement | null; rumble: HTMLAudioElement | null } = { mini: null, angry: null, rumble: null };

    onMount(() => {
        const isBrowser = typeof Audio !== 'undefined';
        if (isBrowser) {
            sounds.mini = new Audio('/sounds/minibutton.ogg');
            if (sounds.mini) sounds.mini.volume = 0.5;

            sounds.angry = new Audio('/sounds/angry.ogg');
            if (sounds.angry) sounds.angry.volume = 0.2;

            sounds.rumble = new Audio('/sounds/rumble.ogg');
            if (sounds.rumble) { sounds.rumble.volume = 0; sounds.rumble.loop = true; }
        }

        // Função que pausa tudo se o usuário mudar de aba no navegador
        const handleVisibilityChange = () => {
            if (document.hidden) {
                Object.values(sounds).forEach(audio => {
                    if (audio && !audio.paused) {
                        gsap.killTweensOf(audio); // Corta os fades de volume do GSAP
                        audio.pause();
                    }
                });
            }
        };

        // Adiciona o espião de aba do navegador
        document.addEventListener("visibilitychange", handleVisibilityChange);

        // Cleanup: Roda quando o componente é destruído (troca de página)
        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
            
            Object.values(sounds).forEach(audio => {
                if (audio) {
                    gsap.killTweensOf(audio);
                    audio.pause();
                    audio.currentTime = 0;
                }
            });
            clearTimeout(comboTimeout);
        };
    });

    function handleAvatarClick(event: MouseEvent) {
        if (isEnraged) return;

        // Pega as coordenadas e as dimensões da imagem
        const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        // Encontra o centro exato
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        // Calcula a distância do clique até o centro
        const distance = Math.hypot(x - centerX, y - centerY);
        const maxDistance = Math.hypot(centerX, centerY);
        
        // Precisão vai de 0 (borda) a 1 (centro exato)
        const accuracy = Math.max(0, 1 - (distance / maxDistance));
        
        // Dano base: ~10 (borda) até ~120 (centro perfeito) + um pouco de aleatoriedade
        let damage = Math.floor(10 + (100 * Math.pow(accuracy, 2)) + Math.random() * 10);
        
        let damageColor = "#facc15"; // Amarelo padrão
        let damageScale = 1;

        // Se acertou bem no meio (mais de 80% de precisão) -> CRÍTICO!
        if (accuracy > 0.8) {
            damageColor = "#f97316"; // Fica laranja
            damageScale = 1.4;       // Fica maior
            damage += 30;            // Bônus de dano
        }

        totalDamage += damage;
        
        if (sounds.mini) {
            sounds.mini.currentTime = 0;
            sounds.mini.play().catch(() => {});
        }

        // Rumble agora aumenta proporcionalmente à "vida" que falta
        if (sounds.rumble && sounds.rumble.paused) sounds.rumble.play().catch(() => {});
        if (sounds.rumble) {
            gsap.to(sounds.rumble, { volume: Math.min((totalDamage / maxHealth) * 0.4, 0.4), duration: 0.2, overwrite: true });
        }

        clearTimeout(comboTimeout);
        comboTimeout = setTimeout(() => {
            if (!isEnraged) resetCombo();
        }, 1500);

        const avatarWrapper = document.querySelector('.avatar-interactive') as HTMLElement;

       // Se bateu na vida máxima, dispara o surto
        if (totalDamage >= maxHealth) {
            triggerEnrage(x, y, avatarWrapper); // <-- AQUI: adicionei o avatarWrapper
        } else {
            // Hit normal
            if (avatarWrapper) {
                gsap.killTweensOf(avatarWrapper);
                gsap.to(avatarWrapper, {
                    scale: 0.96,
                    duration: 0.05,
                    yoyo: true,
                    repeat: 1
                });
            }
            spawnParticle(x, y, `-${damage}`, damageColor, damageScale);
        }
    }

    function spawnParticle(x: number, y: number, text: string, color: string, scale: number) {
        const id = particleIdCounter++;
        particles = [...particles, { id, x, y, text, color, scale }];

        // Remove a partícula do DOM depois de um tempo
        setTimeout(() => {
            particles = particles.filter(p => p.id !== id);
        }, 1000);
    }

    function triggerEnrage(x: number, y: number, avatarWrapper: HTMLElement | null) {
        isEnraged = true;

        if (!avatarWrapper) return;

        gsap.killTweensOf(avatarWrapper);

        // 1. Aplica a classe da vibração perfeita e o filtro vermelho
        avatarWrapper.classList.add('avatar-stunned');
        gsap.to(avatarWrapper, {
            filter: 'drop-shadow(0 0 30px rgba(239, 68, 68, 0.8)) brightness(0.8) sepia(1) hue-rotate(-50deg) saturate(5)',
            scale: 1.05,
            duration: 0.2
        });

        // 2. Espera exatos 1000ms com a imagem tremendo loucamente
        setTimeout(() => {
            // Remove a classe de vibração
            avatarWrapper.classList.remove('avatar-stunned');

            // 3. O tempo estourou! Dispara o Som e o texto Critical
            spawnParticle(x, y, "CRITICAL!", "#ef4444", 1.8);

            if (sounds.angry) {
                sounds.angry.currentTime = 0;
                sounds.angry.play().catch(() => {});
            }
            
            if (sounds.rumble) {
                gsap.to(sounds.rumble, { volume: 0, duration: 0.5, onComplete: () => sounds.rumble?.pause() });
            }

            // AQUI ESTÁ A MUDANÇA: Zeramos o status e o dano acumulado
            isEnraged = false;
            totalDamage = 0;

            // 4. Efeito de saída (flash brilhante) e volta para o estado original
            gsap.fromTo(avatarWrapper, 
                { scale: 1.15, filter: 'brightness(2) saturate(0)' }, 
                { 
                    x: 0, 
                    y: 0, 
                    scale: 1, 
                    filter: 'none', 
                    duration: 1.2, 
                    ease: "power2.out" 
                }
            );

            // Libera para jogar de novo depois de 1.5s
            setTimeout(resetCombo, 1500); 
        }, 1000); 
    }

    function resetCombo() {
        totalDamage = 0;
        isEnraged = false;
        if (sounds.rumble) {
            gsap.to(sounds.rumble, { volume: 0, duration: 0.5, onComplete: () => sounds.rumble?.pause() });
        }
    }
</script>

<Bounded data-slice-type={slice.slice_type} data-slice-variation={slice.variation}>
    <div class="grid gap-x-8 gap-y-6 md:grid-cols-[2fr,1fr]">
        <Heading size="xl" class="col-start-1">
            {slice.primary.heading}
        </Heading>

        <div class="col-start-1 prose prose-invert prose-slate prose-xl">
            <PrismicRichText field={slice.primary.description}/>
        </div>

        <div class="flex flex-wrap gap-4 col-start-1">
            {#if 'button_file' in slice.primary}
                <Button 
                    linkField={slice.primary.button_file} 
                    label={slice.primary.button_label_2} 
                    icon={IconDownload} 
                />
            {/if}
        </div>
            
        <div 
            class="avatar-container row-start-1 max-w-sm md:col-start-2 md:row-end-3 relative cursor-crosshair select-none"
            on:mousedown={handleAvatarClick}
            role="button"
            tabindex="0"
            aria-label="Interact with avatar"
        >
            <div 
                class="avatar-interactive transition-transform transform-gpu relative"
                class:vibe-1={totalDamage >= 100 && totalDamage < 250 && !isEnraged}
                class:vibe-2={totalDamage >= 250 && totalDamage < 400 && !isEnraged}
                class:vibe-3={totalDamage >= 400 && totalDamage < 500 && !isEnraged}
                class:avatar-stunned={isEnraged}
            >
                <Avatar image={slice.primary.avatar} />
            </div>

            {#each particles as particle (particle.id)}
                <span 
                    class="damage-particle absolute pointer-events-none font-black tracking-tighter drop-shadow-md"
                    style="
                        left: {particle.x}px; 
                        top: {particle.y}px; 
                        color: {particle.color};
                        transform: scale({particle.scale}) translate(-50%, -50%);
                    "
                >
                    {particle.text}
                </span>
            {/each}
        </div>
    </div>
</Bounded>

<style>
    .avatar-container {
        /* Adiciona uma mira divertida quando passa o mouse por cima da foto */
        cursor: url("https://api.iconify.design/mdi:target.svg?color=%23ef4444&width=32"), crosshair;
        touch-action: manipulation; /* Evita zoom duplo no celular ao clicar rápido */
    }

    .damage-particle {
        z-index: 50;
        font-size: 1.5rem;
        -webkit-text-stroke: 1px black; /* Bordinha preta pra dar vibe de jogo */
        animation: floatUp 1s cubic-bezier(0.25, 1, 0.5, 1) forwards;
    }

    @keyframes floatUp {
        0% {
            opacity: 1;
            translate: 0 0;
            scale: 0.5;
        }
        20% {
            scale: 1.2;
        }
        100% {
            opacity: 0;
            translate: 0 -80px; /* Sobe 80px e some */
            scale: 1;
        }
    }
    .avatar-stunned {
        animation: shake-angry 0.1s infinite !important;
    }

    /* Vibes e Stun */
    .vibe-1 { animation: v1 0.1s infinite; }
    .vibe-2 { animation: v2 0.1s infinite; }
    .vibe-3 { animation: v3 0.08s infinite; }
    @keyframes v1 { 0%, 100% { translate: 0; } 50% { translate: 0 -2px; } }
    @keyframes v2 { 0%, 100% { translate: 0; } 50% { translate: 0 -4px; } }
    @keyframes v3 { 0%, 100% { translate: 0; } 25% { translate: 4px -4px; } 75% { translate: -4px 4px; } }

    .avatar-stunned { animation: shake-angry 0.1s infinite !important; }
    @keyframes shake-angry {
        0% { transform: translateX(0) rotate(0deg); }
        25% { transform: translateX(-8px) rotate(-3deg); }
        75% { transform: translateX(8px) rotate(3deg); }
        100% { transform: translateX(0) rotate(0deg); }
    }
</style>