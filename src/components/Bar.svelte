<script lang="ts">
    import { blur } from "svelte/transition";
    import range from "../lib/range";
    const epic_gamer_list = [
        "/images/gifs/1.gif",
        "/images/gifs/2.gif",
        "/images/gifs/3.gif",
        "/images/gifs/4.gif",
        "/images/gifs/5.gif",
        "/images/gifs/6.gif",
        "/images/gifs/7.gif",
        "https://images-ext-1.discordapp.net/external/5-qxq28IiE8SkcXfEBt4leMv_NkYEtoMp_1fiN9qKHs/https/media2.giphy.com/media/v1.Y2lkPTZjMDliOTUyYmpmZzE4eGliOThvbmZkem9oanBicGs5NmJvODh5bzN5cGl5azBiMSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/oVAtWqMtwTJ6IEGPx5/giphy.gif?width=528&height=524",
    ]

    // preload the images so we can spam this shit!
    // idk if this works, and i MIGHT make a system to load the images more intelligently
    // also the whole gif thing is a lil underwhelming so i might have to just scrap it entirely
    let preloaded_images = epic_gamer_list.map((link) => {
        let newimage = new Image()
        newimage.src = link
    })

    let bigboy_imagery: string | null = $state(null);
    function bigboy_mouseenter() {
        let rand = Math.ceil(range(Math.random(), 0, 1, 0, epic_gamer_list.length - 1))
        bigboy_imagery = epic_gamer_list[rand];
        console.log(bigboy_imagery)
    }

    function bigboy_mouseleave() {
        bigboy_imagery = null;
    }
</script>

<div class="bar">
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
        bottom: 1em;
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