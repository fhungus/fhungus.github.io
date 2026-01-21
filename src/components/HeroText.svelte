<script lang="ts">
    import { onMount } from 'svelte';
    import range from '../lib/range';

    let text = "fhungus"
    // not unicode compliant! no emojis or wacky characters please!
    let text_states: [number, number, number][] = $state(text.split('').map((_)=>{
        return [0,0,0]
    }))

    onMount(() => {
        let timeout: any = null;
        function shaking() {
            const intensity = 5;
            const yintensity = 5;
            const rotintensity = 5;
            text_states.forEach(element => {
                element[0] = range(Math.random(), 0, 1, -intensity / 2, intensity / 2);
                element[1] = range(Math.random(), 0, 1, -yintensity / 2, yintensity / 2);
                element[2] = range(Math.random(), 0, 1, -rotintensity / 2, rotintensity / 2);
            });

            timeout = setTimeout(shaking,1000/30);
        }

        shaking();

        return () => {
            if (timeout) {
                clearTimeout(timeout);
            }
        }

    })
</script>

{#snippet shakeycharacter(character: string, x: number, y: number, rot: number)}
    <div style="margin-left: {x}px; margin-right:{-x}px; margin-top:{y}px; margin-bottom:{-y}px; rotate:{rot}deg;">
        {character}
    </div>
{/snippet}

<div class="herotext_wrapper">
    {#each text as character, index}
        {@render shakeycharacter(character, text_states[index][0], text_states[index][1], text_states[index][2])}
    {/each}
</div>

<style>
    .herotext_wrapper {
        display: flex;
        flex-direction: row;
        justify-content: end;

        margin-right: 1em;
    }    

    @media (width <= 80rem) {
        .herotext_wrapper {
            justify-content: start;
        }
    }

    .herotext_wrapper > div {
        font-size: 10em;

        mix-blend-mode: color-dodge;
        color: #5cb396;

        font-size: 10em;
        font-weight: 500;
    }
</style>