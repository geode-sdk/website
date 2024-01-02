import * as crypto from 'node:crypto';
import { writeFile } from 'node:fs/promises';

const manifest = {
    "version": "2.6.1",
    "description": "Command line application for Geode SDK, the Geometry Dash modding framework.",
    "license": "BSL-1.0",
    "homepage": "https://github.com/geode-sdk/cli",
    "architecture": {
        "64bit": {
            "url": "https://github.com/geode-sdk/cli/releases/download/v2.6.1/geode-cli-v2.6.1-win.zip",
            "hash": "bd9dd6b96610d906fbbabfb6c0bd659d1d282b02a681141290dae3ac591bcb21"
        }
    },
    "bin": "geode.exe",
    "checkver": "github",
    "autoupdate": {
        "architecture": {
            "64bit": {
                "url": "https://github.com/geode-sdk/cli/releases/download/v$version/geode-cli-v$version-win.zip"
            }
        }
    }
};

function hashBuffer(blob) {
    return crypto.createHash('sha256').update(blob).digest('hex');
}

async function main() {
    console.log("Fetching latest CLI release");
    const url = "https://api.github.com/repos/geode-sdk/cli/releases/latest";
    const data = await (await fetch(url)).json();

    const version = data.tag_name.substr(1);
    manifest.version = version;

    console.log(`Latest release is ${version}!`);

    let asset;
    for (let x of data.assets) {
        if (!x.name.includes("-win.zip")) continue;
        asset = x;
        break;
    }
    if (!asset) return;

    console.log(`Found windows asset, downloading it -> ${asset.name}`);

    manifest.architecture["64bit"].url = asset.browser_download_url;

    const blob = await (await fetch(asset.browser_download_url)).blob();
    const buffer = Buffer.from(await blob.arrayBuffer());
    const hash = hashBuffer(buffer);

    manifest.architecture["64bit"].hash = hash;

    writeFile('dist/geode-sdk-cli.json', JSON.stringify(manifest, null, 4));

    console.log("Done writing scoop manifest!");
}

main();