<script lang="ts">
    import { blur } from "svelte/transition";
    import { Spring } from "svelte/motion";
    import { onMount } from "svelte";
    import range from "../lib/range";

    // springothy...
    let body_spring = new Spring(0);

    let last_scroll_position = 0;
    onMount(() => {
        last_scroll_position = window.scrollY;
        document.addEventListener("scroll", () => {
            let delta = window.scrollY - last_scroll_position;
            last_scroll_position = window.scrollY;
            
            body_spring.set(body_spring.current - (delta * .05), {instant: true})
            body_spring.set(0);
        });
    });

    // bar funny image related things
    const epic_gamer_list = [
        "/images/gifs/1.gif",
        "/images/gifs/2.gif",
        "/images/gifs/3.gif",
        "/images/gifs/4.gif",
        "/images/gifs/5.gif",
        "/images/gifs/6.gif",
        "/images/gifs/7.gif",
        "/images/gifs/8.gif",
    ]

    let getRandomLink = () => {
        let rand = Math.ceil(range(Math.random(), 0, 1, 0, epic_gamer_list.length - 1))

        // create a new image object which we immediately forget about, which should force the browser to load whatever image we linked...
        let image = new Image();
        image.src = epic_gamer_list[rand]

        return image.src;
    }

    let nextup = getRandomLink();
    let bigboy_imagery: string | null = $state(null);
    function bigboy_mouseenter() {
        bigboy_imagery = nextup;
        nextup = getRandomLink();
    }

    function bigboy_mouseleave() {
        bigboy_imagery = null;
    }
</script>

<div class="bar" style="bottom: calc(1em + {body_spring.current}px); transform: rotateX({-body_spring.current}deg);">
    <div class="bartextlink bigboy bordered" onmouseenter={bigboy_mouseenter} onmouseleave={bigboy_mouseleave} role="button" tabindex="-1">
        {#if bigboy_imagery != null}
            <img alt="epic gif?!, idk" transition:blur src={bigboy_imagery}/>
        {/if}
        <p>fhungus</p>
    </div>
    <div class="divider"></div>
</div>

<style>
    .bar {
        position: fixed;
        right: 1em;
        background-color: var(--bg2);

        border-radius: 5px;
        align-items: center;

        min-height: 1em;

        flex-direction: row-reverse;
        align-items: stretch;

        z-index: 50;
        padding: 0.2em;

        display: flex;

    }

    .bartextlink {
        line-height: 0;
    }

    .divider {
        content: " ";

        margin: .25em .25em .25em .25em ;

        background-color: var(--border);
        height: auto;
        width: 2px;
    }

    .bigboy {
        background: radial-gradient(200% 100% at bottom right,rgb(238, 130, 6) 0%, rgb(255, 199, 80) 50%, rgb(115, 223, 192)100%);

        font-weight: bold;
        text-align: center;
        font-size:1.5em;

        width: 6em;

        border-radius: 4px;

        filter: brightness(0.7);
    
        position: relative;
    }

    .bigboy > img {
        position: absolute;
        left: 0;
        width: 100%;
        height: 100%;
        object-fit: fill;
        filter: blur(2px);
        
        clip-path :fill-box;
    }

    .bigboy > p {
        mix-blend-mode: color-dodge;
        color: #5cb396;
    }
</style>