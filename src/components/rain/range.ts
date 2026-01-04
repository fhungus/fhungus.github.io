// TODO: unify this and the other range.ts file (too lazy to change the file path....)
export default function range(num: number, min1: number, max1: number, min2: number, max2: number): number {
    return min2 + ((num - min1) / (max1 - min1) * (max2 - min2))
}