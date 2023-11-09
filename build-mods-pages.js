
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
import { htmlEscape } from 'escape-goat';

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
            // logo: tryReadFile(`${d}/logo.png`, 'media/no-logo.png'),
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

function withIfEmpty(arr, elem) {
    if (!arr.length) {
        arr.push(elem);
    }
    return arr;
}

function cutText(text) {
    if (text.length > 70) {
        return text.substring(0, 67) + "...";
    }
    else {
        return text;
    }
}

function escape(x) {
    return htmlEscape(String(x));
}

function html(parts) {
    let result = parts[0];
    for (let i = 1; i < parts.length; ++i) {
        result += escape(arguments[i]) + parts[i];
    }
    return result;
}

function pathEscape(x) {
    return x.replaceAll(/\.{2,}/g, '.') // Remove multiple dots
}

function filepath(parts) {
    let result = parts[0];
    for (let i = 1; i < parts.length; ++i) {
        result += pathEscape(arguments[i]) + parts[i];
    }
    return result;
}

for (const mod of mods) {
    searchPageContent.push(html`
        <article
            class="mod-card"
            data-name="${mod.versions[0].modJSON.name}"
            data-developer="${mod.versions[0].modJSON.developer}"
            data-description="${mod.versions[0].modJSON.description}"
            data-about="${mod.about.replace(/\"/g, '')}"
            data-tags="${mod.versions[0].entryJSON.tags?.join('') ?? ''}"
            data-default-score=${mods.length - searchPageContent.length}
        >
            <div class="info">
                <div class="img"><img src="${mod.logoURL}"></div>
                <h1>${mod.versions[0].modJSON.name}</h1>
                <h3><i class="author">${mod.versions[0].modJSON.developer}</i> • <i class="version">${mod.versions[0].version}</i></h3>
                <p class="short-desc">${cutText(mod.versions[0].modJSON.description)}</p>
            </div>
            <div class="buttons">
                <a href="./${pathEscape(mod.id)}">View</a>
            </div>
        </article>
    `);

    mkdirSync(filepath`gen/mods/${mod.id}`);
    writeFileSync(filepath`gen/mods/${mod.id}/index.html`,
        modPageTemplate
            .replace(/\$MOD_ID/g, escape(mod.id))
            .replace(/\$MOD_NAME/g, escape(mod.versions[0].modJSON.name))
            .replace(/\$MOD_VERSION_LINKS/g, mod.versions
                .map(ver => html`<a
                    href="${ver.entryJSON.mod.download}"
                    class="
                        button wide
                        border-solid border-2 border-light border-opacity-25 hover:border-cyan
                        bg-opacity-0 hover:bg-opacity-0
                        px-10
                    "
                ><i data-feather="download"></i>${ver.version}</a>`)
                .join('')
            )
            .replace(/\$MOD_VERSION/g, escape(mod.versions[0].version))
            .replace(/\$MOD_DEVELOPER/g, escape(mod.versions[0].modJSON.developer))
            .replace(/\$MOD_ICON_URL/g, escape(mod.logoURL))
            .replace(/\$MOD_DOWNLOAD_URL/g, escape(mod.versions[0].entryJSON.mod.download))
            .replace(/\$MOD_ABOUT_MD/g, marked(mod.about))
            .replace(/\$MOD_LINKS/g, withIfEmpty(Object.entries({
                'repository': 'github',
            })
                .filter(link => link[0] in mod.versions[0].modJSON)
                .map(link => html`
                    <a
                        class="button wide border-solid border-2 border-gray-light"
                        href="${mod.versions[0].modJSON[link[0]]}"
                    >
                        <i data-feather="${link[1]}"></i>
                        Repository
                    </a>
                `), html`
                    <a
                        class="emptylink wide border-solid border-2 border-gray-light"
                    >
                        No links available
                    </a>
                `)
                .join('')
            )
            .replace(/\$MOD_TAGS/g, withIfEmpty(mod.versions[0].entryJSON.tags.map(tag => html`
                <span class="mod-tag">${tag}</span>
            `), '<span class="mod-tag mod-tag-none">None</span>').join(''))
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
