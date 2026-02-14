<script lang="ts">
    import { blur } from "svelte/transition";
    import { Spring, Tween } from "svelte/motion";
    import { onMount } from "svelte";
    import range from "../lib/range";
    import { derived } from "svelte/store";

    const sections: {text: string, path: string, imagery: string}[] = [
        {
            text: "blog",
            path: "/blog/",
            imagery: "/"
        },        
        {
            text: "projects",
            path: "/proj/",
            imagery: "/"
        },
        {
            text: "drawings",
            path: "/draw/",
            imagery: "/"
        },
        { // we gotta put home last because every other path also qualifies as it ):
            text: "home",
            path: "/",
            imagery: "/"
        },
    ]

    // springothy...
    let body_spring = new Spring(0);

    // fun element! the stalker: follows and surrounds the selected object
    const stalker_gap = 3;
    let selected = $state(sections.findIndex((sect) => {
        return window.location.pathname.startsWith(sect.path)
    }) || 0)
    let stalker_position = {
        x: new Spring(0),
        w: new Spring(1),
        h: new Spring(1),
    }

    let container: Element;
    let stalker: Element;

    let last_scroll_position = 0;

    let toload: string[] = [];
    let evilassfunction = (link: string) => {
        // queue up the links to load, this will be replaced on mount!
        toload.push(link);
        return link;
    }

    $inspect(stalker_position)

    let setStalkerRect = (rect: DOMRect, instant: boolean | null) => {
        let props = {
            instant: instant || undefined
        };
        stalker_position.h.set(rect.height - (2*stalker_gap), props);
        stalker_position.w.set(rect.width - (2*stalker_gap), props);
        stalker_position.x.set(rect.x + stalker_gap - container.getBoundingClientRect().x, props);
    }

    let resetStalkerToSelected = (instant: boolean) => {
        // get current ob        
        let children = container.children
        let path_element;
        for(let i=0;i<=children.length;i++) {
            let child = children.item(i);
            if (sections[selected].path == child?.id) {
                path_element = child
                break;
            };
        };

        if (path_element) {
            setStalkerRect(path_element.getBoundingClientRect(), instant);
        }
    }

    onMount(() => {
        last_scroll_position = window.scrollY;
        document.addEventListener("scroll", () => {
            let delta = window.scrollY - last_scroll_position;
            last_scroll_position = window.scrollY;
            
            body_spring.set(body_spring.current - (delta * .05), {instant: true})
            body_spring.set(0);
        });

        // replace the evil ass function, make it save the contents of the next image to cache! 
        evilassfunction = (link: string) => {
            let image = new Image(); // we can't use these outside of onMount() or svelte will jumpscare us
            image.src = link;
            return link;
        } 
        toload.map(evilassfunction); // load the queued images using our epic new function

        resetStalkerToSelected(true);
    });

    // bar funny image related things
    const epic_gamer_list: string[] = ([] as string[]); // my very secret schema... nyess...
    for (let i=1;i<=28;i++) {
        epic_gamer_list.push(`/images/gifs/${i+1}.gif`)
    }

    let getRandomLink = () => {
        let rand = Math.ceil(range(Math.random(), 0, 1, 0, epic_gamer_list.length - 1))

        // create a new image object which we immediately forget about, which should force the browser to load whatever image we linked...
        return evilassfunction(epic_gamer_list[rand])
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

{#snippet section(text: string, path: string, imagery: string, i: number)}
    <button id={path} data-imagery={imagery} 
    onmouseenter={(e)=>{
        setStalkerRect(e.currentTarget.getBoundingClientRect(), false);
    }} 
    onmouseleave={()=>{resetStalkerToSelected(false)}}
    onmousedown={()=>{if (window.location.pathname != path) { window.location.pathname = path}}}>
        {text}
    </button>
{/snippet}

<div class="bar" style="bottom: calc(1em + {body_spring.current}px); transform: rotateX({-body_spring.current}deg);">
    <div class="bartextlink bigboy bordered" onmouseenter={bigboy_mouseenter} onmouseleave={bigboy_mouseleave} role="button" tabindex="-1">
        {#if bigboy_imagery != null}
            <img alt="epic gif?!, idk" transition:blur src={bigboy_imagery}/>
        {/if}
        <p>fhungus</p>
    </div>

    <div class="divider"></div>

    <div class="sections" bind:this={container}>
        <div bind:this={stalker} class="stalker" style="left:{stalker_position.x.current}px; top:{stalker_gap}px; width:{stalker_position.w.current}px; height:{stalker_position.h.current}px;"></div>
        {#each sections as s, i}
            {@render section(s.text, s.path, s.imagery, i)}
        {/each}
    </div>
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

    .sections {
        position: relative;
        display: flex;
        background-color: var(--bg);
    }

    .sections > button {
        display: flex;
        align-items: center;
        padding-left: 2em;
        padding-right: 2em;
        background-color: transparent;
        border-style: none;

		font-family: GoMono, monospace;
        color: var(--fg);

        z-index: 10;
    }

    .stalker {
        background-color: var(--bg2);
        content: " ";
        position: absolute;

        z-index: 0;
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