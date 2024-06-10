import { readFileSync, writeFileSync } from 'fs';

let faqPage = readFileSync('src/faq/index.html').toString();
let questionsHtml = "";
let discordInvite = `https://discord.gg/9e43WMKzhp`;
let codeblockOpen = `<code class="one-line-code-block">`;
let codeblockClose = `</code>`;
let hyperlinkCSS = `class="underline text-yellow hover:text-cyan"`;
let helpChannel = `and drop by the ${codeblockOpen}#help${codeblockClose} channel`;

const faq = [
    {
        question: `I can't find the Geode button.`,
        answer: `
        <span>All users:</span>
        <li>Make sure you've followed the installation instructions for your specifc platform.
        If you would like to re-download the installer for your specifc platform, check <a ${hyperlinkCSS} href="/install">here</a>.</li>
        <span>Linux users <b>from Steam</b>:</span>
        <li>In your launch options for Geometry Dash, put in ${codeblockOpen}WINEDLLOVERRIDES="xinput9_1_0=n,b" %command%${codeblockClose}.</li>
        <span>Linux users <b>from Lutris</b>:</span>
        <li>Go into ${codeblockOpen}Properties -> Runner Options${codeblockClose} and enter the following:<br>Key: ${codeblockOpen}xinput9_1_0.dll${codeblockClose}<br>
        Value: ${codeblockOpen}n,b${codeblockClose}</li>
        <span>Android users:</span>
        <li>Make sure your Geometry Dash is on version 2.205. Paths should cost 25000 mana orbs,
        and levels such as ONETheLegendOf1000 by JuNiOr202 (Level ID <e>99566839</em>)
        shouldn't be broken.</li>
        <li>Make sure you're loading Geometry Dash from the Geode launcher. You should see the "Loading loader resources" text for a brief moment on the loading screen.</li>
        `
    },
    {
        question: `When will Geode be available for iOS?`,
        answer: `
        There are several issues with iOS that make it very difficult
        for Geode to work as smoothly on iOS as it does compared to other platforms
        that Geode supports, such as being unable to modify apps just before being loaded.
        More technical responses exist on GitHub
        <a ${hyperlinkCSS} href="https://github.com/geode-sdk/geode/issues/598#issuecomment-1983810283">here</a>
        and <a ${hyperlinkCSS} href="https://github.com/geode-sdk/geode/discussions/548#discussioncomment-8551752">here</a>.<br><br>
        iCreate Pro is only possible on iOS because it patches the game once, as explained on GitHub
        <a ${hyperlinkCSS} href="https://github.com/geode-sdk/geode/discussions/548#discussioncomment-9095508">here</a>.<br><br>
        Despite these barriers, there are still ongoing efforts to find a sliver of hope to get
        Geode working on iOS, with a higher priority on jailbroken iOS devices.
        `
    },
    {
        question: `Is Geode only available on GitHub?`,
        answer: `
        Yes.<br><br>
        As Geode is a mod loader, it is impossible to distribute Geode through app stores
        or similar platforms without violating their respective guidelines.<br><br>
        While mod loaders for other video games may exist in any given app store, Geode will
        remain on GitHub.
        `
    },
    // for the rust beggars
    /*
    {
        question: `Will Geode use something besides C++?`,
        answer: `
        <em>No.</em><br><br>
        Much like how mods for Minecraft: Java Edition are written in Java (or Kotlin) in order
        to easily interact with the Minecraft source code, anything from Geode that
        directly interacts with Geometry Dash's C++ source code will also be written in C++.<br><br>
        Technical explanations on the difficulty in implementing
        Geode in other progamming languages can be found
        <a ${hyperlinkCSS} href="https://github.com/geode-sdk/geode/issues/602#issuecomment-1984367223">here</a>
        and
        <a ${hyperlinkCSS} href="https://github.com/geode-sdk/geode/issues/602#issuecomment-2005286510">here</a>.<br><br>
        There's nothing stopping you from attempting to rewrite Geode in a different programming language,
        but the time investment necessary to make it usable for the general public outweighs any probable benefits from doing so.
        `
    },
    */
    {
        question: `What happens when GD updates?`,
        answer: `
        Windows + Android users:<br>
        Geode will be put into a forward compatibility mode.
        All of Geode's ingame features and all your installed mods will be disabled.
        Don't worry though, as Geode will still auto-update to any newly available version.<br><br>
        macOS users:<br>
        Curl up into a fetal position and cry.
        `
    },
    {
        question: `A mod has failed loading.`,
        answer: `
        Install the latest version of Geode
        <a ${hyperlinkCSS} href="/install">here</a>, then try again.<br>
        If you still see the same error, download and install that specific mod again.<br>
        If the issue still persists after that, join our Discord server
        <a ${hyperlinkCSS} href="${discordInvite}">here</a>
        ${helpChannel}.
        `
    },
    {
        question: `A mod has failed unzipping.`,
        answer: `
        <span>Windows/macOS/Linux users:</span>
        <li>Check if there are any more instances of Geometry Dash running
        in Task Manager/Activity Monitor (or your OS's equivalent) and close them.
        Restart your computer if all else fails.</li>
        <span>Android users:</span>
        <li>Please try uninstalling and reinstalling the mod. If you've already attempted this,
        <a ${hyperlinkCSS} href="${discordInvite}">join the Discord server</a>
        ${helpChannel}.
        </li>
        `
    },
    {
        question: `The mod index is still loading.`,
        answer: `
        <span>All users:</span>
        <li>Please find a stronger Internet connection. After that, it should be far smoother sailing if you're not on Android.</li>
        <span>Android users:</span>
        <li>Unzipping the entire mod index is a far slower process on Android compared to other platforms. Please wait until
        <a ${hyperlinkCSS} href="https://twitter.com/geode_sdk/status/1772932163513545204">the new Geode mod index</a>
        is complete, as it eliminates this problem through an entirely different approach.</li>
        `
    },
    {
        question: `I can't open the game!`,
        answer: `
        <span>macOS users:</span>
        <li>Join our Discord server
        <a ${hyperlinkCSS} href="${discordInvite}">here</a>
        ${helpChannel}. If lucky enough, someone from the Geode Team will give you further instructions.</li>
        <span>Windows users:</span>
        <li>Hold the ${codeblockOpen}SHIFT${codeblockClose} key, and without letting go of it, launch Geometry Dash.
        Confirm that you wish to launch Geode in Safe Mode.</li>
        <span>Android users:</span>
        <li>Press and hold the ${codeblockOpen}Launch${codeblockClose} button from the Geode launcher.
        Confirm that you wish to launch Geode in Safe Mode.</li>
        <span>Once you've followed the instructions depending on your platform,
        find the mod causing Geometry Dash to crash on startup and disable/uninstall it.</span>
        `
    }
]

// everything is inside a <p> tag to suppress all line breaks besides manual <br> tags
const addQuestion = (question, answer) => {
    questionsHtml += `<section class="bg-gray-darker flex flex-col gap-4 items-center max-w-txt-or-vw">
        <h1 class="font-head text-2xl self-center">${question}</h1>
        <p>${answer}</p>
    </section>`;
};

async function main() {
    for (const item of faq) {
        addQuestion(item.question, item.answer);
    }

    faqPage = faqPage.replace("$FAQS_HTML", questionsHtml);

    writeFileSync("gen/faq/index.html", faqPage);
}
main();