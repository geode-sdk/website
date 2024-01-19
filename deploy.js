import { execSync } from 'node:child_process';
import { existsSync } from 'node:fs';

if (!existsSync('src')) {
    console.error('This script must be run in the repo root!');
    process.exit(1);
}

// same as build but minifies..
const commands = [
    "node copy-html-files.js",
    "node build-mods-pages.js",
    "node build-install.js",
    "tailwindcss -i gen/index.css -o dist/index.css --minify",
    "tailwindcss -i gen/mods/index.css -o dist/mods/index.css --minify",
    "html-minifier --input-dir ./gen --output-dir ./dist --collapse-whitespace --file-ext html",
    "node copy-media.js",
    "node generate-scoop-cli.js",
]

for (let command of commands) {
    execSync(command);
}