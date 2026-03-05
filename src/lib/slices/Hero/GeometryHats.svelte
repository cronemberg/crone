<script lang="ts">
    import { T as Threlte } from "@threlte/core";
    import { Float, createTransition } from '@threlte/extras';
    import * as THREE from 'three';
    import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
    import gsap from 'gsap';
    import { elasticOut } from 'svelte/easing';
    import { onMount } from 'svelte';

    export let position: [number, number, number] = [0, 0, 0];
    let geometry: THREE.BufferGeometry | null = null;
    let customMaterial: THREE.Material | THREE.Material[] | null = null;
    export let rate = 0.5;
    export let scale: [number, number, number] = [1, 1, 1];

    let modelGroup: THREE.Group = new THREE.Group();
    let meshRef: THREE.Mesh;

    // Inicialização segura dos sons no browser
    const isBrowser = typeof Audio !== 'undefined';
    const soundEffects = isBrowser ? [
        new Audio('/sounds/hit.ogg'),
        new Audio('/sounds/hit1.ogg'),
        new Audio('/sounds/hit2.ogg')
    ] : [];

    // Reduz o volume de todos os sons para 50%
    soundEffects.forEach(sound => {
        sound.volume = 0.3;
    });

    let visible = false;

    const glbFiles = [
        '/models/LittleCrown.glb',
        '/models/Hair.glb',
        '/models/Sombrero.glb',
        '/models/Cartola.glb',
    ];

    const defaultMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 });

    let isLoadingGLB = false; 
    let showNewGLBDelay = 66; 

    function getRandomGLB() {
        return gsap.utils.random(glbFiles);
    }

    // --- TIMER DE 3 SEGUNDOS COM PROTEÇÃO DE ABA ---
    onMount(() => {
        const interval = setInterval(() => {
            // Impede a execução se a aba do navegador não estiver ativa
            if (document.hidden) return;

            if (meshRef && !isLoadingGLB) {
                handleTrigger(meshRef);
            }
        }, 3000); 

        return () => clearInterval(interval);
    });

    // Função centralizada
    function handleTrigger(targetMesh: THREE.Mesh) {
        if (isLoadingGLB) return;

        // Toca um som aleatório (apenas se estivermos no browser e a aba estiver ativa)
        if (soundEffects.length > 0 && !document.hidden) {
            const randomSound = gsap.utils.random(soundEffects);
            randomSound.currentTime = 0; // Reseta para tocar rápido
            randomSound.play().catch(() => {});
        }

        isLoadingGLB = true;

        const randomGLB = getRandomGLB();
        const loader = new GLTFLoader();

        loader.load(randomGLB, (gltf) => {
            const loadedMesh = gltf.scene.children[0] as THREE.Mesh;
            const newGeometry = loadedMesh.geometry;

            let newMaterial;
            if (loadedMesh.material) {
                newMaterial = Array.isArray(loadedMesh.material) ? loadedMesh.material[0] : loadedMesh.material;
            } else {
                newMaterial = defaultMaterial;
            }

            applyRotation(targetMesh);

            setTimeout(() => {
                geometry = newGeometry;
                customMaterial = newMaterial;
                isLoadingGLB = false;
            }, showNewGLBDelay);
            
        }, undefined, (error) => {
            console.error('An error occurred while loading the GLB:', error);
            isLoadingGLB = false;
        });
    }

    function handleClick(event: MouseEvent) {
        const mesh = (event as any).object as THREE.Mesh; 
        if (mesh) {
            handleTrigger(mesh);
        }
    }

    function applyRotation(mesh: THREE.Mesh) {
        gsap.to(mesh.rotation, {
            x: `+=${gsap.utils.random(0, 0)}`,
            y: `+=${gsap.utils.random(0, 0)}`,
            z: `+=${gsap.utils.random(2, 4)}`,
            duration: 1,
            ease: 'elastic.out(1, 0.5)',
            yoyo: true,
        });
    }

    const bounce = createTransition((ref) => {
        return {
            tick(t) {
                if (t > 0) visible = true;
                ref.scale.set(t * scale[0], t * scale[1], t * scale[2]);
            },
            easing: elasticOut,
            duration: gsap.utils.random(800, 1200),
            delay: gsap.utils.random(0, 500)
        };
    });

    // Carregamento inicial do modelo
    if (isBrowser) {
        const loader = new GLTFLoader();
        loader.load('/models/Hair.glb', (gltf) => {
            const loadedMesh = gltf.scene.children[0] as THREE.Mesh;
            geometry = loadedMesh.geometry;
            customMaterial = loadedMesh.material;
        });
    }
</script>

<Threlte.Group position={position.map((p) => p * 2)} object={modelGroup}>
    <Float 
        speed={5 * rate} 
        rotationSpeed={5 * rate} 
        rotationIntensity={6 * rate} 
        floatIntensity={5 * rate}>
        
        {#if geometry}
            <Threlte.Mesh 
                bind:ref={meshRef}
                {visible} 
                {geometry} 
                in={bounce} 
                material={customMaterial}
                interactive
                on:click={handleClick}
                scale={scale}
                position={[0, 0, 0]}
                rotation={[THREE.MathUtils.degToRad(90), THREE.MathUtils.degToRad(45), THREE.MathUtils.degToRad(20)]}  
            />
        {:else} 
             <Threlte.Mesh />
        {/if}    
        
    </Float>
</Threlte.Group>