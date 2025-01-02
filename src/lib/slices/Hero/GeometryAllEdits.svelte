<script lang="ts">
    import { T as Threlte } from "@threlte/core";
    import { Float, createTransition } from '@threlte/extras';
    import * as THREE from 'three';
    import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
    import gsap from 'gsap';
    import { elasticOut } from 'svelte/easing';

    export let position: [number, number, number] = [0, 0, 0];
    let geometry: THREE.BufferGeometry | null = null;
    let customMaterial: THREE.Material | THREE.Material[] | null = null;
    export let rate = 0.5;
    export let scale: [number, number, number] = [1, 1, 1];

    let modelGroup: THREE.Group = new THREE.Group(); // Initialize the model group
    const soundEffects = [
        new Audio('/sounds/hit.ogg'),
        new Audio('/sounds/hit1.ogg'),
        new Audio('/sounds/hit2.ogg')
    ];

    let visible = false;

    const glbFiles = [
        '/static/models/Edit1.glb',
        '/static/models/Edit2.glb',
        '/static/models/Edit3.glb',
        '/static/models/Edit4.glb',
        '/static/models/Edit5.glb',
        '/static/models/Razor.glb',
    ];

    const defaultMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 });

    let isLoadingGLB = false; 
    let showNewGLBDelay = 66; 

    function getRandomGLB() {
        return gsap.utils.random(glbFiles);
    }

    function handleClick(event: MouseEvent) {
        if (isLoadingGLB) return; // Prevent further clicks while loading

        gsap.utils.random(soundEffects).play();

        const mesh = (event as any).object as THREE.Mesh; 
        if (mesh) {
            isLoadingGLB = true;

            const randomGLB = getRandomGLB();
            const loader = new GLTFLoader();

            loader.load(randomGLB, (gltf) => {
                const loadedMesh = gltf.scene.children[0] as THREE.Mesh;
                const newGeometry = loadedMesh.geometry;

                // Check for material
                let newMaterial;
                if (loadedMesh.material) {
                    newMaterial = Array.isArray(loadedMesh.material) ? loadedMesh.material[0] : loadedMesh.material;
                } else {
                    newMaterial = defaultMaterial;
                }

                applyRotation(mesh);

                setTimeout(() => {
                    geometry = newGeometry;
                    customMaterial = newMaterial;

                    isLoadingGLB = false; // Reset loading flag after applying changes
                }, showNewGLBDelay);
                
            }, undefined, (error) => {
                console.error('An error occurred while loading the GLB:', error);
                isLoadingGLB = false; // Reset loading flag in case of an error
            });
        }
    }


    function applyRotation(mesh: THREE.Mesh) {
        gsap.to(mesh.rotation, {
            x: `+=${gsap.utils.random(1, 3)}`,
            y: `+=${gsap.utils.random(1, 3)}`,
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

    // Load initial GLTF
    const loader = new GLTFLoader();
    loader.load('/static/models/Razor.glb', (gltf) => {
        const loadedMesh = gltf.scene.children[0] as THREE.Mesh;

        geometry = loadedMesh.geometry;
        customMaterial = loadedMesh.material;
    });

    // const placeholderGeometry = new THREE.BoxGeometry(2, 2, 2);
    // const placeholderMaterial = new THREE.MeshBasicMaterial({ color: 0xcccccc });

</script>

<Threlte.Group position={position.map((p) => p * 2)} object={modelGroup}>
    <Float 
        speed={5 * rate} 
        rotationSpeed={5 * rate} 
        rotationIntensity={5 * rate} 
        floatIntensity={5 * rate}>
        
        {#if geometry}
            <Threlte.Mesh 
                {visible} 
                {geometry} 
                in={bounce} 
                material={customMaterial}
                interactive
                on:click={handleClick}
                scale={scale}
                position={[0, 0, 0]}
                rotation={[THREE.MathUtils.degToRad(90), THREE.MathUtils.degToRad(0), THREE.MathUtils.degToRad(20)]}  
            />
            {:else} 
             <Threlte.Mesh />
        {/if}    
        
    </Float>
</Threlte.Group>