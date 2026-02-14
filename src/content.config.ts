import { defineCollection } from "astro:content";
import { glob, file } from 'astro/loaders'
import { z, coerce } from 'astro/zod'

const blog = defineCollection({
    loader: glob({ pattern: "**/*.md", base: "./src/pages/blog" }),
    schema: z.object({
        title: z.string(),
        date: coerce.date() // unfortunately, the americans colonized THE DATES!!!, so 1-2-2023 would be JANUARY second. ):
                            // i could probably figure out a way to coerce these types to sane values (iso or something) but ima tire
    })
})

export const collections = {blog}