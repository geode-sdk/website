import { execSync } from 'node:child_process';

const commands = [
    "node build-mods-pages.js",
    "tailwindcss -i gen/index.css -o dist/index.css",
    "tailwindcss -i gen/mods/index.css -o dist/mods/index.css",
    "html-minifier --input-dir ./gen --output-dir ./dist --file-ext html",
    "node copy-media.js",
]

for (let command of commands) {
    execSync(command);
}