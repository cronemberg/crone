<script lang="ts">
    import { T as Threlte } from "@threlte/core";
    import { Float, createTransition } from '@threlte/extras';
    import * as THREE from 'three';
    import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
    import gsap from 'gsap';
    import { elasticOut } from 'svelte/easing';
    import { onMount } from 'svelte';

    export let position: [number, number, number] = [0, 0, 0];
    export let rate = 0.5;
    export let scale: [number, number, number] = [1, 1, 1];
    
    export let forcedInteraction = false;

    let geometry: THREE.BufferGeometry | null = null;
    let customMaterial: THREE.Material | THREE.Material[] | null = null;
    let modelGroup: THREE.Group = new THREE.Group();
    let meshRef: THREE.Mesh; 

    // --- INICIALIZAÇÃO SEGURA DE ÁUDIO ---
    const isBrowser = typeof Audio !== 'undefined';
    const soundEffects = isBrowser ? [
        new Audio('/sounds/hit.ogg'),
        new Audio('/sounds/hit1.ogg'),
        new Audio('/sounds/hit2.ogg')
    ] : [];

    // Reduz o volume geral para 50%
    soundEffects.forEach(sound => {
        sound.volume = 0.5;
    });

    let visible = false;

    const glbFiles = [
        '/models/Face1.glb',
        '/models/Face2.glb',
        '/models/Face3.glb',
        '/models/Face4.glb',
        '/models/Face5.glb',
        '/models/Face6.glb',
    ];

    const defaultMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
    let isLoadingGLB = false; 
    let showNewGLBDelay = 0; 

    function getRandomGLB() {
        return gsap.utils.random(glbFiles);
    }

    // --- TIMER COM PROTEÇÃO DE ABA ---
    onMount(() => {
        const interval = setInterval(() => {
            // Impede a execução se a aba do navegador não estiver ativa
            if (document.hidden) return;

            if (meshRef && !isLoadingGLB) {
                handleTrigger(meshRef);
            }
        }, 5000); 

        return () => clearInterval(interval);
    });

    $: if (forcedInteraction && meshRef && !isLoadingGLB) {
        handleTrigger(meshRef);
    }

    function handleClick(event: any) {
        if (isLoadingGLB) return;
        handleTrigger(event.object);
    }

    function handleTrigger(targetMesh: THREE.Mesh) {
        if (isLoadingGLB || !targetMesh) return;

        isLoadingGLB = true;
        
        // --- TOCA SOM APENAS SE A ABA ESTIVER ATIVA ---
        if (soundEffects.length > 0 && !document.hidden) {
            const randomSound = gsap.utils.random(soundEffects);
            randomSound.currentTime = 0; // Reseta para tocar rapidamente sem engasgar
            randomSound.play().catch(() => {});
        }

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

    function applyRotation(mesh: THREE.Mesh): THREE.Euler {
        const targetXAngle = getNearestXAngle(THREE.MathUtils.radToDeg(mesh.rotation.x));
        const targetZAngle = getNearestZAngle(THREE.MathUtils.radToDeg(mesh.rotation.z));

        gsap.to(mesh.rotation, {
            x: THREE.MathUtils.degToRad(gsap.utils.random(targetXAngle + 0.2, targetXAngle + 0.2)),
            y: `+=${gsap.utils.random(0, 0)}`,
            z: THREE.MathUtils.degToRad(gsap.utils.random(targetZAngle + 0.13, targetZAngle + 0.2)),
            onUpdate: () => {
                mesh.rotation.x = THREE.MathUtils.lerp(mesh.rotation.x, THREE.MathUtils.degToRad(targetXAngle), 20);
                mesh.rotation.z = THREE.MathUtils.lerp(mesh.rotation.z, THREE.MathUtils.degToRad(targetZAngle), 20);
            },
            ease: 'elastic.out(1.2, 0.5)',
            yoyo: true,
            duration: 1.2
        });

        return mesh.rotation;
    }

    function getNearestZAngle(angle: number): number {
        angle = (angle + 360) % 360; 
        return (angle < 90 || angle > 270) ? 0 : 180;
    }

    function getNearestXAngle(angle: number): number {
        return 90;
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

    // Proteção SSR para o carregamento inicial
    if (isBrowser) {
        const loader = new GLTFLoader();
        loader.load('/models/Face1.glb', (gltf) => {
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