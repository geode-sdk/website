import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";
import { enhancedImages } from "@sveltejs/enhanced-img";
import svelteFluent from "@nubolab-ffwd/svelte-fluent/vite"

export default defineConfig({
    plugins: [
        enhancedImages(),
        sveltekit(),
        svelteFluent(),
    ],
});
