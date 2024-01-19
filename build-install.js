import { readFileSync, writeFileSync } from 'fs';

let installPage = readFileSync('src/install/index.html').toString();

console.log("Fetching latest Geode release from github");
async function main() {
    const data = await (await fetch('https://api.github.com/repos/geode-sdk/geode/releases/latest')).json();
    installPage = installPage.replace("{$GITHUB_RELEASE_DATA:0}", JSON.stringify(data));

    const dataLauncher = await (await fetch('https://api.github.com/repos/geode-sdk/android-launcher/releases/latest')).json();
    installPage = installPage.replace("{$GITHUB_ANDROID_LAUNCHER_RELEASE_DATA:0}", JSON.stringify(dataLauncher));

    writeFileSync("gen/install/index.html", installPage);
}
main();
