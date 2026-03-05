<script lang="ts">
    import { T as Threlte } from "@threlte/core";
    import * as THREE from 'three';
    import { ContactShadows, Environment, interactivity, transitions } from "@threlte/extras";
    
    // Importação dos seus componentes de geometria
    import GeometryFaces from "../Hero/GeometryFaces.svelte";
    import GeometryHats from "../Hero/GeometryHats.svelte";

    interactivity();
    transitions();
</script>

<Threlte.PerspectiveCamera
    makeDefault
    position={[0,0,13]}
    aspect={1}
    fov={30}
    near={1}
    far={40}
/>

<Environment files="smallroom.hdr" path="/" format="hdr" />
<ContactShadows position={[0, -3, 0]} opacity={0.25} scale={40} blur={1} far={9}/>
<Threlte.AmbientLight intensity={0.3} />

<GeometryFaces 
    position={[0,0,0]} 
    rate={0.3} 
    scale={[3.3,13,3.2]} 
/>

<GeometryHats 
    position={[-1,0.8,0]} 
    rate={0.6} 
    scale={[1,1,1]} 
/>