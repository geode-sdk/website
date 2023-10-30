
// This script builds the mods browsing site

import { Presets, SingleBar } from 'cli-progress';
import { createReadStream, createWriteStream, existsSync, mkdirSync, readdirSync, renameSync, rmSync, writeFileSync } from 'fs';
import { copy } from 'fs-extra';
import request from 'request';
import { Extract, Open } from 'unzipper';

if (!existsSync('src')) {
    console.error('This script must be run in the repo root!');
    process.exit(1);
}

// Download mods index
if (!existsSync('_mods_tmp')) {
    const bar = new SingleBar({
        format: '{bar} {percentage}% {status}'
    }, Presets.shades_classic);

    bar.start(100, 0, { status: 'Downloading mods index' });

    const req = request('https://github.com/geode-sdk/mods/archive/refs/heads/main.zip');
    let len = 0;
    req.on('response', res => {
        console.log(res.headers['content-length']);
        len = parseInt(res.headers['content-length']);
    });
    req.on('data', chunk => {
        bar.update((chunk.byteOffset + chunk.byteLength) / len * 100, {
            status: `len: ${len}`
        });
    });
    await req.pipe(Extract({ path: '__mods' })).promise();
    
    bar.update(100, { status: 'Moving files' })
    renameSync('__mods/mods-main/mods-v2', '_mods_tmp');
    rmSync('__mods', { recursive: true, force: true });

    bar.stop();
}

const bar = new SingleBar({
    format: '{bar} {percentage}% {status}'
}, Presets.shades_classic);
bar.start(100, 0, { status: 'Copying files' });

// Make gen dir, replacing old one if it exists
copy('src', 'gen', { overwrite: true });

// Iterate downloaded mods to construct the browse page first

bar.update('Constructing search page');

const dirs = readdirSync('_mods_tmp', { withFileTypes: true })
    .filter(dir => dir.isDirectory())
    .map(dir => `${dir.path}/${dir.name}`);

let count = 1;
for (const dir of dirs) {
    bar.update(count / dirs.length * 100, dir);
    count += 1;
}
bar.stop();
