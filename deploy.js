import { execSync } from 'node:child_process';

// same as build but minifies..
const commands = [
    "node build-mods-pages.js",
    "tailwindcss -i gen/index.css -o dist/index.css --minify",
    "tailwindcss -i gen/mods/index.css -o dist/mods/index.css --minify",
    "html-minifier --input-dir ./gen --output-dir ./dist --collapse-whitespace --file-ext html",
    "node copy-media.js",
]

for (let command of commands) {
    execSync(command);
}