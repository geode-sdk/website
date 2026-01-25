import { paraglideVitePlugin } from '@inlang/paraglide-js'
import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";
import { enhancedImages } from "@sveltejs/enhanced-img";

export default defineConfig({
    plugins: [
        paraglideVitePlugin({ project: './project.inlang', outdir: './src/lib/paraglide' }),
        enhancedImages(),
        sveltekit()
    ],
});
