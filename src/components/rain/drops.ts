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
        const chance = range(Math.random(), 0, 1, -1,7);
        if (chance > 0) {
            for (let i=0; i<chance; i++) {
                const xpos = range(Math.random(), 0, 1, -this.w/2, this.w + (this.w/2));
                this.drops.push({
                    velocity: {x: 250, y: 1000} as Vec,
                    position: {x: xpos, y: 0} as Vec,
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
            /*
            function iswithinrange(num: number, othernum: number, rangewidth: number): boolean {
                return num > othernum - rangewidth && num < othernum + rangewidth
            }

            // if mouse is in frame and droplet is too close, bounce it away
            if (mouse != null && !drop.bounced && iswithinrange(drop.position.x, mouse.x, 20) && iswithinrange(drop.position.y, mouse.y, 20)) {
                drop.bounced = true;

                // uh oh calc time
                let normal = add_vecs(drop.position, negate_vec(mouse));
                let normmag = Math.sqrt((normal.x ^ 2) + (normal.y ^ 2));
                normal.x = normal.x / normmag;
                normal.y = normal.y / normmag;
                let nx = drop.position.x - ((drop.position.x * normal.x) / (normal.x ^ 2));
                let ny = drop.position.y - ((drop.position.y * normal.y) / (normal.y ^ 2));

                console.log(nx);
                drop.position = {
                    x: nx,
                    y: ny,
                };

                // get the difference between the new position and mouse to calculate our velocities new position
                // and we're not slowing it down because its fun
                let diffx = nx - mouse.x;
                let diffy = ny - mouse.y;
                let diffmag = Math.sqrt((normal.x ^ 2) + (normal.y ^ 2));
                
                diffx = diffx * (1 / diffmag);
                diffy = diffy * (1 / diffmag);

                let velmag = Math.sqrt(drop.velocity.x * drop.velocity.y);
                drop.velocity = {
                    x: diffx * velmag,
                    y: diffy * velmag,
                }
            }
            */
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