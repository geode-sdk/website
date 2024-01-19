import { readFileSync, writeFileSync } from 'fs';

let installPage = readFileSync('src/install/index.html').toString();

console.log("Fetching latest Geode release from github");
fetch('https://api.github.com/repos/geode-sdk/geode/releases/latest')
    .then(r => r.json())
    .then(data => {
        const str = JSON.stringify(data);
        installPage = installPage.replace("{$GITHUB_RELEASE_DATA:0}", str);
        writeFileSync("gen/install/index.html", installPage);
    });
