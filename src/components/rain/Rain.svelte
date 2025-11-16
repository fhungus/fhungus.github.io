<script lang="ts">
    // my ass importing swelte only to not use it whatsoever :sob:
    import { onMount } from "svelte";
    import { on } from 'svelte/events';
    import Drops from "./drops";

    let canvas: HTMLCanvasElement;
    onMount(() => {
        //FIXME: when screen size changes, canvas does not update its own size! make it listen for size changes and change accordingly
        let rect = canvas.getBoundingClientRect();
        canvas.height = rect.height;
        canvas.width = rect.width;

        let drops = new Drops(canvas.width, canvas.height);
  
        let mouseincanvas = false;
        let mousex = 0;
        let mousey = 0;
        on(canvas, "mousemove", (e) => {
            mousex = e.clientX - rect.x;
            mousey = e.clientY - rect.y;
        })
        on(canvas, "mouseenter", (_) => {
            mouseincanvas = true
        })
        on(canvas, "mouseleave", (_) => {
            mouseincanvas = false
        })

        let ctx: CanvasRenderingContext2D = canvas.getContext("2d")!;
        let drawingTimeout: NodeJS.Timeout;
        let onTimeout = () => {
            ctx.clearRect(0,0,canvas.width,canvas.height);
            drops.step(45/1000, mouseincanvas ? {x: mousex, y: mousey} : null);

            ctx.beginPath();

            drops.drops.map(function(drop, _i, _a) {
                const otherx = Math.floor(drop.position.x - (drop.velocity.x * 0.25));
                const othery = Math.floor(drop.position.y - (drop.velocity.y * 0.25));

                let gradient = ctx.createLinearGradient(Math.floor(drop.position.x), Math.floor(drop.position.y), otherx, othery);
                let antiopacity = 1 / drop.opacity;
                const color = "52,85,68"

                gradient.addColorStop(1, `rgba(${color},0)`)
                gradient.addColorStop(0, `rgba(${color},${drop.opacity})`);
                ctx.lineWidth = 2 * antiopacity;
                ctx.fillStyle = gradient;
                ctx.strokeStyle = gradient;
                ctx.beginPath();
                ctx.moveTo(drop.position.x, drop.position.y);
                ctx.lineTo(otherx, othery);
                ctx.closePath();
                ctx.stroke();
                ctx.beginPath();
                ctx.arc(drop.position.x, drop.position.y, 1.5 * antiopacity, 0, Math.PI*2);
                ctx.closePath();
                ctx.fill();
            });
            drawingTimeout = setTimeout(onTimeout, 1000/45);
        }
        onTimeout();

        return () => {
            drawingTimeout.close()
        }
    })
</script>

<canvas bind:this={canvas} class="rain"></canvas>

<style>
    .rain {
        z-index: 21;
        position: absolute;
        top: 0;
        bottom: 0;
        right: 0;
        left: 0;
        width: 100%;
        height: 100%;
        mix-blend-mode: color-dodge;
    }
</style>