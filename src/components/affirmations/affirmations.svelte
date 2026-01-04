<script lang="ts">
    // copied my shit ass code here as well
    import { onMount } from "svelte";
    import { blur } from "svelte/transition";
    import { on } from 'svelte/events';

    import range from './range'

    let active = $state(true);

    // i have GOTTA start abstracting some of this shit!!!
    class AffirmationEntity {
        variant: 1 | 2 | 3 = 1;
        vx = 0;
        vy = 0;
        x = 0;
        y = 0;
        opacity = 0;

        constructor(w: number, h: number) {
            let num: 1 | 2 | 3 = 1;
            let guhhihatejs = range(Math.random(), 0,1, 0,3);
            if (guhhihatejs > 2) {
                num = 3
            } else if (guhhihatejs > 1) {
                num = 2
            } else {
                num = 1
            }
            this.variant = num;

            this.vx = range(Math.random(), 0,1, -500, 500);
            this.vy = range(Math.random(), 0,1, -500, 500);

            this.x = range(Math.random(), 0,1, 0,w); 
            this.y = range(Math.random(), 0,1, 0,h); 

            this.opacity = range(Math.random(), 0,1, 0.25,1);
        }

        stepFrame(dt: number, w: number, h: number, mouse: MousePosition, others: AffirmationEntity[]) {
            this.x += this.vx * dt;
            this.y += this.vy * dt;

            this.vy += 500 * dt;

            // bounce off ground & ceiling
            if (this.y > h - 15 && this.vy > 0 || this.y < 0 && this.vy < 0) {// EPIC magic number....
                this.vy = this.vy * -0.8;
            }

            // bounce from sides
            if (this.x <= 0 && this.vx < 0 || this.x >= w  && this.vx > 0) {
                this.vx *= -1;
            }

            // eww... collisions..
            const RANGE = 10;
            const COLLISION_DISPLACEMENT = 200 * dt;
            others.map((other) => {
                if (Math.abs(this.x - other.x) < RANGE) {
                    this.vx += COLLISION_DISPLACEMENT * (this.x - other.x > 0 ? 1 : -1)
                    other.vx -= COLLISION_DISPLACEMENT * (this.y - other.y > 0 ? 1 : -1)
                }
                if (Math.abs(this.y - other.y) < RANGE) {
                    this.vy += COLLISION_DISPLACEMENT * (this.y - other.y > 0 ? 1 : -1)
                    other.vy -= COLLISION_DISPLACEMENT * (this.y - other.y > 0 ? 1 : -1)
                }
            })

            let vx_sign = this.vx > 0 ? 1 : -1;
            let vy_sign = this.vy > 0 ? 1 : -1;

            // repelled by cursor
            if (mouse.active) {
                let dx = this.x - mouse.x;
                let dy = this.y - mouse.y;
                let dx_sign = dx > 0 ? 1 : -1;
                let dy_sign = dy > 0 ? 1 : -1;

                const RANGE = 1000;
                let decent_gaussian = (x: number) => {
                    const PEAK = 2500;
                    let gaussian = PEAK * Math.exp(-((x^2) / (RANGE ^2)))
                    gaussian -= (PEAK * 1.2) * Math.exp(-((x^2)/((RANGE/10)^2))) // THUNK!
                    return gaussian
                }
                if (Math.abs(dx) < RANGE) {
                    this.vx -= decent_gaussian(dx) * dt
                }
                if (Math.abs(dy) < RANGE) {
                    //console.log(`${this.y} - ${mouse.y} = ${dy}`)
                    this.vy -= decent_gaussian(dy) * dt
                }
            }

            // THE FUCKING SPEED LIMIT!!!
            const SPEED_LIMIT = 700
            if (this.vx > SPEED_LIMIT || this.vx < -SPEED_LIMIT) { // theres no math.clamp function, how sad...
                this.vx = SPEED_LIMIT * vx_sign;
            }
            if (this.vy > SPEED_LIMIT || this.vy < -SPEED_LIMIT) { // theres no math.clamp function, how sad...
                this.vy = SPEED_LIMIT * vy_sign;
            }
        }
    }

    class Affirmations {
        affirmations: AffirmationEntity[] = []
        width: number = 0;
        height: number = 0;
        constructor(w: number, h: number) {
            this.width = w;
            this.height = h;
            
            const affirmations = 25;
            for (var i = 0; i < affirmations; i++) {
                let affirmation_entity = new AffirmationEntity(w, h);
                this.affirmations.push(affirmation_entity);
            }
        }

        stepFrame(dt: number, mouse: MousePosition) {
            this.affirmations.forEach(element => {
                element.stepFrame(dt, this.width, this.height, mouse, this.affirmations)
            });
        }
    }
    
    class MousePosition {
        x = 0;
        y = 0;
        active = true;

        constructor(x: number, y: number, active: boolean) {
            this.x = x;
            this.y = y;
            this.active = active;
        }
    }

    let canvas: HTMLCanvasElement;
    onMount(() => {
        //FIXME: when screen size changes, canvas does not update its own size! make it listen for size changes and change accordingly
        let rect = canvas.getBoundingClientRect();
        canvas.height = rect.height;
        canvas.width = rect.width;

        let affirmations = new Affirmations(canvas.width, canvas.height);

        let mouseincanvas = false;
        let mousex = 0;
        let mousey = 0;
        on(canvas, "mousemove", (e) => {
            let rect = canvas.getBoundingClientRect();
            mousex = e.clientX - rect.x;
            mousey = e.clientY - rect.y;

            console.log(`${e.clientY} - ${rect.y} = ${mousey}`)
        })
        on(canvas, "mouseenter", (_) => {
            mouseincanvas = true
        })
        on(canvas, "mouseleave", (_) => {
            mouseincanvas = false
        })

        let last_scroll_position = window.scrollY;
        document.addEventListener("scroll", (_) => {
            let delta = window.scrollY - last_scroll_position;
            last_scroll_position = window.scrollY;

            affirmations.affirmations.map((aff, _) => {
                aff.vy += delta * 2
            })
        })

        let ctx: CanvasRenderingContext2D = canvas.getContext("2d")!;
        let drawingTimeout: NodeJS.Timeout;
        let onTimeout = (tick: number) => {
            let now = new Date().getTime();
            let mouse = new MousePosition(mousex, mousey, mouseincanvas)
            if (active) {
                affirmations.stepFrame((now - tick) / 1000, mouse)
                ctx.clearRect(0,0,canvas.width,canvas.height);
                ctx.font = `bold 14px GoMono`;

                const TEXT_HEIGHT = 10
                const ROUNDING = 1
                affirmations.affirmations.map((aff, _) => {
                    ctx.fillStyle = `rgba(${aff.variant == 1 ? "116,225,195" : aff.variant == 2 ? "198,209,142" : "255,255,92"}, ${aff.opacity})`
                    let forwards = aff.variant == 1 ? "< ><" : aff.variant == 2 ? "{ }:{" : "< >::"
                    let backwards = aff.variant == 1 ? ">< >" : aff.variant == 2 ? "}:{ }" : "::< >"
                    ctx.fillText(`${aff.vx < 0 ? forwards : backwards}`, Math.round(aff.x/ROUNDING)*ROUNDING, Math.round((aff.y - (TEXT_HEIGHT / 2)) / ROUNDING) * ROUNDING)
                })
            }

            drawingTimeout = setTimeout(onTimeout, 1000/45, new Date().getTime());
        }
        onTimeout(new Date().getTime());

        return () => {
            drawingTimeout.close()
        }
    })
</script>
<div class="affirmations">
    <button class="affirmations_button" onclick={()=>{active=!active}}>
        <div>
            {active ? "):<" : "(:"}
        </div>
    </button>
    {#if !active}
    <div transition:blur class="pause_text"> <!--appears when the fish are paused...-->
        Your fish have been paused.<br/><br/>
        This thing is here because I make them do a lot of wacky calculations and they might be particulary lag inducing.
    </div>
    {/if}
    <canvas bind:this={canvas} class={`affirmations_canvas ${!active && "halfopacity"}`}></canvas>
</div>

<style>
    .affirmations {
        width: 100%;
        height: 36em;

        border-color: #546b5f;
        border-width: 2px;
        border-style: solid;
        border-radius: 7px;

        background-color: #171c18;

        position: relative;
        display: flex;
    }

    .affirmations_canvas {
        transition: all cubic-bezier(0.075, 0.82, 0.165, 1) 0.5s;
        position: absolute;

        bottom: 0;
        left: 0;
        right: 0;

        width: 100%;
        height: 100%;
    }

    .affirmations_canvas.halfopacity {
        opacity: 0.25;
    }

    .pause_text {
        align-self:center;
        text-align: center;
        position: absolute;

        padding: 2em;
        font-size:0.75em;

        color: #546b5f;
    }

    .affirmations_button {
        transition: all linear .2s;

        position: absolute;
        top: 0;
        right: 0;

        display: center;
        align-items: center;
        justify-items: center;

        border-style: solid;
        border-color: #546b5f;

        border-top: transparent;
        border-right: transparent;

        background-color: #263433;
        color: #546b5f;
        width: 2.5em;
        height: 2.5em;

        font-family: "GoMono";
        font-weight: bold;

        border-radius: 0 5px 0 5px;
        
        z-index: 10;
    }

    .affirmations_button:hover {
        background-color: var(--bg2);
        color: var(--fg);
        border-color: var(--border);
    }

    .affirmations_button:active {
        background-color: var(--fg);
        color: var(--bg2);
    }

</style>