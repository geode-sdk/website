
// This script builds the mods browsing site

import { Presets, SingleBar } from 'cli-progress';
import { createWriteStream, existsSync, mkdirSync, readFileSync, readdirSync, renameSync, rmSync, writeFileSync } from 'fs';
import { copy } from 'fs-extra';
import { pipeline } from 'stream/promises';
import { Extract } from 'unzip-stream';
import got from 'got';
import { setTimeout } from 'timers/promises';
import { rcompare, valid } from 'semver';
import { marked } from 'marked';

if (!existsSync('src')) {
    console.error('This script must be run in the repo root!');
    process.exit(1);
}

const indexBar = new SingleBar({
    format: '{bar} {percentage}% {status}'
}, Presets.shades_classic);

indexBar.start(100, 0, { status: 'Downloading mods index' });

// Download mods index
if (!existsSync('_mods_tmp') || process.argv.at(2) === '-r') {
    rmSync('_mods_tmp', { recursive: true, force: true });

    await pipeline(
        got.stream('https://github.com/geode-sdk/mods/archive/refs/heads/main.zip')
            .on('downloadProgress', prog => {
                indexBar.update(prog.percent * 99);
            }),
        Extract({ path: '__mods' })
    );
    
    indexBar.update(99, { status: 'Moving files' })
    renameSync('__mods/mods-main/mods-v2', '_mods_tmp');
    rmSync('__mods', { recursive: true, force: true });

    indexBar.update(100, { status: 'Mods index downloaded' });
}
else {
    indexBar.update(100, { status: 'Using cached mods index' });
}
indexBar.stop();

const modsBar = new SingleBar({
    format: '{bar} {percentage}% {status}'
}, Presets.shades_classic);
modsBar.start(100, 0, { status: 'Parsing mods' });

function tryReadFile(path, or = undefined) {
    try {
        return readFileSync(path);
    }
    catch {
        return or ? tryReadFile(or) : undefined;
    }
}

// Iterate downloaded mods to construct the browse page first
const mods = readdirSync('_mods_tmp', { withFileTypes: true })
    .filter(dir => dir.isDirectory())
    .map((dir, i, arr) => {
        const d = `${dir.path}/${dir.name}`;
        modsBar.update(i / arr.length * 100);
        return {
            id: dir.name,
            versions: readdirSync(d, { withFileTypes: true })
                .filter(dir => dir.isDirectory() && valid(dir.name))
                .map(ver => {
                    return {
                        version: ver.name,
                        modJSON: JSON.parse(readFileSync(`${ver.path}/${ver.name}/mod.json`).toString()),
                        entryJSON: JSON.parse(readFileSync(`${ver.path}/${ver.name}/entry.json`).toString()),
                    };
                })
                .sort((a, b) => rcompare(a.version, b.version)),
            about: tryReadFile(`${d}/about.md`)?.toString(),
            logo: tryReadFile(`${d}/logo.png`, 'media/no-logo.png'),
            logoURL: existsSync(`${d}/logo.png`) ?
                `https://raw.githubusercontent.com/geode-sdk/mods/main/mods-v2/${dir.name}/logo.png` :
                `https://raw.githubusercontent.com/geode-sdk/geode/main/loader/resources/logos/no-logo.png`
        };
    });

modsBar.update(100, { status: 'Mods parsed' });
modsBar.stop();

const genBar = new SingleBar({
    format: '{bar} {percentage}% {status}'
}, Presets.shades_classic);
genBar.start(100, 0, { status: 'Copying files' });

// Make gen dir, replacing old one if it exists
if (existsSync('gen')) {
    rmSync('gen', { recursive: true, force: true });
}
await copy('src', 'gen', { overwrite: true });
rmSync('gen/mods/[mod.id]', { recursive: true, force: true });

genBar.update(0, { status: 'Constructing pages' });

const modPageTemplate = readFileSync('src/mods/[mod.id]/index.html').toString();
const searchPageContent = [];

for (const mod of mods) {
    searchPageContent.push(`
        <article
            class="mod-card"
            data-name="${mod.versions[0].modJSON.name}"
            data-developer="${mod.versions[0].modJSON.developer}"
            data-description="${mod.versions[0].modJSON.description}"
            data-about="${mod.about.replace(/\"/g, '')}"
        >
            <h1>${mod.versions[0].modJSON.name}</h1>
            <h3><i class="author">${mod.versions[0].modJSON.developer}</i> • <i class="version">${mod.versions[0].version}</i></h3>
            <img src="${mod.logoURL}">
            <p class="short-desc">${mod.versions[0].modJSON.description}</p>
            <a href="./${mod.id}">View</a>
        </article>
    `);

    mkdirSync(`gen/mods/${mod.id}`);
    writeFileSync(`gen/mods/${mod.id}/index.html`,
        modPageTemplate
            .replace(/\$MOD_ID/g, mod.id)
            .replace(/\$MOD_NAME/g, mod.versions[0].modJSON.name)
            .replace(/\$MOD_VERSION_LINKS/g, mod.versions
                .map(ver => `<a
                    href="${ver.entryJSON.mod.download}"
                    class="
                        button has-icon
                        border-solid border-2 border-light border-opacity-25 hover:border-cyan
                        bg-opacity-0 hover:bg-opacity-0
                        px-10
                    "
                ><i data-feather="download"></i>${ver.version}</a>`)
                .join('')
            )
            .replace(/\$MOD_VERSION/g, mod.versions[0].version)
            .replace(/\$MOD_DEVELOPER/g, mod.versions[0].modJSON.developer)
            .replace(/\$MOD_ICON_URL/g, mod.logoURL)
            .replace(/\$MOD_DOWNLOAD_URL/g, mod.versions[0].entryJSON.mod.download)
            .replace(/\$MOD_ABOUT_MD/g, marked(mod.about))
            .replace(/\$MOD_REPO/g, mod.versions[0].modJSON.repository)
            .replace(/\$MOD_AVAILABLE_PLATFORMS/g, Object.entries({
                'windows': 'media/windows.svg',
                'macos':   'media/apple.svg',
                'android': 'media/android.svg',
                'ios':     'media/ios.svg',
            })
                .filter(plat => mod.versions[0].entryJSON.platforms.includes(plat[0]))
                .map(plat => readFileSync(plat[1]).toString())
                .join('')
            )
            .replace(/\$MOD_UNAVAILABLE_PLATFORMS/g, Object.entries({
                'windows': 'media/windows.svg',
                'macos':   'media/apple.svg',
                'android': 'media/android.svg',
                'ios':     'media/ios.svg',
            })
                .filter(plat => !mod.versions[0].entryJSON.platforms.includes(plat[0]))
                .map(plat => readFileSync(plat[1]).toString())
                .join('')
            )
    );
    genBar.update(searchPageContent.length / mods.length * 99);
}

genBar.update(99, { status: 'Writing search page' });
writeFileSync('gen/mods/index.html',
    readFileSync('src/mods/index.html').toString()
        .replace(/\$INSERT_MODS_CONTENT_HERE/g, searchPageContent.join(''))
);
genBar.update(100, { status: 'Pages finished' });
genBar.stop();
