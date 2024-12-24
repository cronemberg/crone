<!-- <script lang="ts">
    import {T as Threlte} from "@threlte/core";
    import { Float } from '@threlte/extras';
    import * as THREE from 'three';

    export let position: [number, number, number] = [0,0,0];
    export let geometry: THREE.BufferGeometry = new THREE.IcosahedronGeometry(3);
    export let rate = 0.5;

    const material = new THREE.MeshStandardMaterial({color: "cornflowerblue", roughness: 0.1, metalness: 0.5})
</script>

<Threlte.Group position={position.map((p)=>p*2)}>
    <Float 
    speed={5 * rate} 
    rotationSpeed={5*rate} 
    rotationIntensity={6*rate} 
    floatIntensity={5*rate}>
    
        <Threlte.Mesh {geometry} {material}></Threlte.Mesh>
    </Float>
</Threlte.Group> 






















<script lang="ts">
    import {T as Threlte} from "@threlte/core";
    import { Float } from '@threlte/extras';
    import * as THREE from 'three';
	import { color, roughness } from "three/webgpu";
    import gsap from 'gsap';



    export let position: [number, number, number] = [0,0,0];
    export let geometry: THREE.BufferGeometry = new THREE.IcosahedronGeometry(3);
    export let rate = 0.5;

    
    const materialParams = [
        {color: 'cornflowerblue', roughness: 0.1, metalness: 0.5},
        {color: 'purple', roughness: 0.8}
    ];

    function getRandomMaterial(){
        return new THREE.MeshStandardMaterial(gsap.utils.random(materialParams));
    }


</script>

<Threlte.Group position={position.map((p)=>p*2)}>
    <Float 
    speed={5 * rate} 
    rotationSpeed={5*rate} 
    rotationIntensity={6*rate} 
    floatIntensity={5*rate}>
    
        <Threlte.Mesh {geometry} material={getRandomMaterial}></Threlte.Mesh>
    </Float>
</Threlte.Group>-->