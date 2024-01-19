import { existsSync, rmSync } from 'fs';
import { copy } from 'fs-extra';

// Make gen dir, replacing old one if it exists
if (existsSync('gen')) {
    rmSync('gen', { recursive: true, force: true });
}
await copy('src', 'gen', { overwrite: true });