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
        'src/lib/slices/otherimages/GLTF/Face1.glb',
        'src/lib/slices/otherimages/GLTF/Face2.glb',
        'src/lib/slices/otherimages/GLTF/Face3.glb',
        'src/lib/slices/otherimages/GLTF/Face4.glb',
        'src/lib/slices/otherimages/GLTF/Face5.glb',
        'src/lib/slices/otherimages/GLTF/Face6.glb',
    ];


    const defaultMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 });

    let isLoadingGLB = false; 
    let showNewGLBDelay = 0; 

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


    function applyRotation(mesh: THREE.Mesh): THREE.Euler {
    // Get the nearest target angles for X and Z
    const targetXAngle = getNearestXAngle(THREE.MathUtils.radToDeg(mesh.rotation.x)); // Nearest X angle (90 or 270)
    const targetZAngle = getNearestZAngle(THREE.MathUtils.radToDeg(mesh.rotation.z));  // Nearest Z angle (0 or 180)

    // Start with a bit of randomness and ensure final angles are exact
    gsap.to(mesh.rotation, {
        // Start with some random motion but end at target angles
        x: THREE.MathUtils.degToRad(gsap.utils.random(targetXAngle + 0.2, targetXAngle + 0.2)), // Random near the target X
        y: `+=${gsap.utils.random(0, 0)}`, // Random Y for variety
        z: THREE.MathUtils.degToRad(gsap.utils.random(targetZAngle + 0.13, targetZAngle + 0.2)), // Random near the target Z
        //After this random motions the rotation ends in final angles
        onUpdate: () => {
            
            mesh.rotation.x = THREE.MathUtils.lerp(mesh.rotation.x, THREE.MathUtils.degToRad(targetXAngle), 20); // Gradually move to target X
            mesh.rotation.z = THREE.MathUtils.lerp(mesh.rotation.z, THREE.MathUtils.degToRad(targetZAngle), 20); // Gradually move to target Z
        },
        ease: 'elastic.out(1.2, 0.5)', // Smooth elastic easing for bouncy effect
        yoyo:true,
        duration: 1.2 // Duration of the animatior
    });

    return mesh.rotation; // Return the updated rotation
}


    // Helper function to determine the nearest angle (0 or 180)
    function getNearestZAngle(angle: number): number {
        // Normalize angle to the range of 0-360
        angle = (angle + 360) % 360; 

        // Determine nearest angle
        if (angle < 90 || angle > 270) {
            return 0; // Closer to 0
        } else {
            return 180; // Closer to 180
        }
    }

    function getNearestXAngle(angle: number): number {
        // Normalize angle to the range of 0-360
        angle = (angle + 360) % 360; 

            return 90; // Closer to 0

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
    loader.load('src/lib/slices/otherimages/GLTF/Face1.glb', (gltf) => {
        const loadedMesh = gltf.scene.children[0] as THREE.Mesh;

        geometry = loadedMesh.geometry;
        customMaterial = loadedMesh.material;
    });

    const placeholderGeometry = new THREE.BoxGeometry(2, 2, 2);
    const placeholderMaterial = new THREE.MeshBasicMaterial({ color: 0xcccccc });

</script>

<Threlte.Group position={position.map((p) => p * 2)} object={modelGroup}>
    <Float 
        speed={5 * rate} 
        rotationSpeed={5 * rate} 
        rotationIntensity={6 * rate} 
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
                rotation={[THREE.MathUtils.degToRad(90), THREE.MathUtils.degToRad(45), THREE.MathUtils.degToRad(20)]}  
            />
            {:else} 
             <Threlte.Mesh 
                 geometry={placeholderGeometry} 
                 material={placeholderMaterial} />
        {/if}    
        
    </Float>
</Threlte.Group>