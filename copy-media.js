import { readdirSync, copyFileSync } from 'fs';

for (const file of readdirSync('media')) {
    copyFileSync(`media/${file}`, `dist/${file}`);
}
