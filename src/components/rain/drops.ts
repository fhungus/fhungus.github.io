import range from './range.ts';

type Vec = {
    x: number,
    y: number
}

function add_vecs(v1: Vec, v2: Vec): Vec {
    return {x: v1.x + v2.x, y: v1.y + v2.y};
}

function negate_vec(vec: Vec): Vec {
    return {x: -vec.x, y: -vec.y};
}

type Raindrop = {
    velocity: Vec,
    position: Vec,
    opacity: number,
    bounced: boolean
}

class Drops {
    drops: Raindrop[] = [];
    w: number = 0;
    h: number = 0;

    constructor(iw: number, ih: number) {
        this.w = iw;
        this.h = ih;
    }

    step(dt: number, mouse: {x: number, y: number} | null) {
        // add new raindrops, maybe
        const chance = range(Math.random(), 0, 1, -1,30);
        if (chance > 0) {
            for (let i=0; i<chance; i++) {
                const xpos = range(Math.random(), 0, 1, -this.w/2, this.w + (this.w/2));
                this.drops.push({
                    velocity: {x: 250, y: 1000} as Vec,
                    position: {x: xpos, y: 0 - range(Math.random(),  0, 1, 0, 100)} as Vec,
                    opacity: Math.random(),
                    bounced: false
                })
            }
        }

        // add velocity and update it (also mouse stuff)
        this.drops = this.drops.map(function(drop, _i, _a) {
            drop.position.x += drop.velocity.x * dt;
            drop.position.y += drop.velocity.y * dt;

            drop.velocity.y += 10 * dt;

            // was planning on adding mouse interactions but it too hard 😢 (i don't know what math i'm doing)
            function iswithinrange(num: number, othernum: number, rangewidth: number): boolean {
                return num > othernum - rangewidth && num < othernum + rangewidth
            }
           
            return drop;
        })

        // filter out drops
        const h = this.h;
        this.drops = this.drops.filter(
            (drop, _i, _a) => {
                return drop.position.y < h + 500
            });
    }
}

export default Drops;
