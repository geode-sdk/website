import { execSync } from 'node:child_process';
import { existsSync } from 'node:fs';

if (!existsSync('src')) {
    console.error('This script must be run in the repo root!');
    process.exit(1);
}

const commands = [
    "node copy-html-files.js",
    "node build-mods-pages.js",
    "node build-install.js",
    "tailwindcss -i gen/index.css -o dist/index.css",
    "tailwindcss -i gen/mods/index.css -o dist/mods/index.css",
    "html-minifier --input-dir ./gen --output-dir ./dist --file-ext html",
    "node copy-media.js",
]

for (let command of commands) {
    execSync(command, {
        stdio: 'inherit'
    });
}