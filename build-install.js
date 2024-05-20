import { readFileSync, writeFileSync } from 'fs';
import { htmlEscape } from 'escape-goat';
import * as feather from 'feather-icons';

let installPage = readFileSync('src/install/index.html').toString();

console.log("Fetching latest Geode release from github");
async function main() {
    const data = await (await fetch('https://api.github.com/repos/geode-sdk/geode/releases/latest')).json();
    console.log(`Latest version is ${data.tag_name}`);
    const dataLauncher = await (await fetch('https://api.github.com/repos/geode-sdk/android-launcher/releases/latest')).json();
    console.log(`Latest launcher version is ${dataLauncher.tag_name}`);


    installPage = installPage.replace("$LATEST_VERSION_TAG", data.tag_name);

    let platformsHtml = "";
    const addPlatform = (name, url) => {
        platformsHtml += `<a href="${url}" class="button wide border-solid border-2 border-gray-light text-left" onclick="scrollToTutorial()">
            ${feather.icons.box.toSvg()} Download for ${htmlEscape(name)}
        </a>`;
    };

    dataLauncher.assets.reverse();
    for (const asset of [...data.assets, ...dataLauncher.assets]) {
        let assetName = asset.name.toLowerCase();
        let platformName;

        if (assetName.includes('installer')) {
            if (assetName.includes('mac')) {
                platformName = 'Mac';
            } else if (assetName.includes('win')) {
                platformName = 'Windows';
            }
        } else if (assetName.includes('.apk')) {
            if (assetName.endsWith('-android32.apk')) {
                continue;
            } else {
                platformName = 'Android';
            }
        }
        if (!platformName) continue;

        addPlatform(platformName, asset.browser_download_url);
    }

    installPage = installPage.replace("$INSTALL_OPTIONS_HTML", platformsHtml);


    writeFileSync("gen/install/index.html", installPage);
}
main();
