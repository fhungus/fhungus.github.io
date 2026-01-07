<script lang="ts">
    import { onMount } from "svelte";
    import PopulationElement from "./PopulationElement.svelte";

    let elements = $state([]);
    let element: Element;

    onMount(()=>{
        let element_size = element.getBoundingClientRect();
    })
</script>

<div class="recursive" bind:this={element}>
    {#each elements as e}

    {/each}
</div>

<style>

</style>