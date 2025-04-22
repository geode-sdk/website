<script lang="ts">
    import Button from "$lib/components/Button.svelte";
    import Column from "$lib/components/Column.svelte";
    import FlyIntoView from "$lib/components/FlyIntoView.svelte";
    import Gap from "$lib/components/Gap.svelte";
    import Icon from "$lib/components/Icon.svelte";
    import Image from "$lib/components/Image.svelte";
    import InfoBox from "$lib/components/InfoBox.svelte";
    import Link from "$lib/components/Link.svelte";
    import Rollover from "$lib/components/Rollover.svelte";
    import Row from "$lib/components/Row.svelte";
    import Waves from "$lib/components/Waves.svelte";
    import { onMount } from "svelte";
    import type { PageData } from "./$types.js";

    export let data: PageData;

    // Until server returns this, we're doing it manually
    let latestVersion = data.loader_tag;
    let latestLauncher = `v${data.launcher_tag}`;
    let showAllPlatforms = false;
    let curPlatform: "windows" | "mac" | "android" | "linux" | "unknown" | undefined = undefined;

    const createVersionString = (platform: "windows" | "mac" | "android" | "linux"): string => {
        let filename = "";
        switch (platform) {
            case "linux":
            case "windows":
                filename = `geode-installer-${latestVersion}-win.exe`;
                break;
            case "mac":
                filename = `geode-installer-${latestVersion}-mac.pkg`;
                break;
            case "android":
                filename = `geode-launcher-${latestLauncher}.apk`;
                break;
        }
        if (platform === "android") {
            const nonV = latestLauncher.substring(1);
            return `https://github.com/geode-sdk/android-launcher/releases/download/${nonV}/${filename}`;
        } else {
            return `https://github.com/geode-sdk/geode/releases/download/${latestVersion}/${filename}`;
        }
    };

    onMount(() => {
        if (window.navigator.userAgent.includes("Windows")) {
            curPlatform = "windows";
        } else if (window.navigator.userAgent.includes("Macintosh")) {
            curPlatform = "mac";
        } else if (window.navigator.userAgent.includes("Android")) {
            curPlatform = "android";
        } else if (window.navigator.userAgent.includes("Linux")) {
            curPlatform = "linux";
        } else {
            curPlatform = "unknown";
            showAllPlatforms = true;
        }
    });
</script>

<Waves type="top" />
<Gap size="large" />

<svelte:head>
    <title>Install Geode</title>
    <meta name="description" content="Install Geode on Windows, Android and MacOS" />
</svelte:head>

<h1>Install Geode</h1>

<div class="installation">
    <Column>
        <section>
            <Column>
                <p><strong>Installation instructions</strong></p>
                <span style="color: var(--background-300)">
                    <Column align="left">
                        <Row>
                            <Icon icon="one" />
                            <p>
                                Download the <em>installer</em>
                                for the platform you want.
                            </p>
                        </Row>
                        <Row>
                            <Icon icon="two" />
                            <p>Run the installer.</p>
                        </Row>
                    </Column>
                </span>
                <p>
                    Geode is available for <em>Windows</em>
                    ,
                    <em>MacOS</em>
                    ,
                    <em>Linux</em>
                    (through
                    <em>Wine / Proton</em>
                    ) and
                    <em>Android</em>
                    .
                </p>
            </Column>
        </section>
        <section class:hidden={!data.error}>
            <InfoBox type="error">
                Could not determine the latest Geode release.

                <br />
                <br />

                You can download Geode <Link
                    --link-color="var(--accent-300)"
                    href="https://github.com/geode-sdk/geode/releases/latest">
                    here
                </Link>.
                <br />
                Android users should install <Link
                    --link-color="var(--accent-300)"
                    href="https://github.com/geode-sdk/android-launcher/releases/latest">
                    the Android launcher
                </Link> instead.
            </InfoBox>
        </section>
        <section class:hidden={data.error}>
            <Column>
                <div>
                    Latest version: <em>{latestVersion}</em>
                </div>
                {#if curPlatform === "unknown"}
                    <p>Couldn't auto detect your platform. You can download Geode for your chosen platform below.</p>
                {/if}
                {#if curPlatform === "linux"}
                    <p>
                        Geometry Dash is not available on <em>Linux</em>
                        , but you can run the
                        <em>Windows</em>
                        version through
                        <em>Wine / Proton</em>
                        . <Link href="faq#i-am-installing-geode-on-linux-what-do-i-have-to-do">
                            Click here for more info.
                        </Link>
                    </p>
                    <Button design="primary-filled" href={createVersionString("windows")}>
                        <Icon icon="windows" />Download for Windows
                    </Button>
                {/if}
                {#if curPlatform === "android"}
                    <div>
                        Latest Android Launcher version: <em>{latestLauncher}</em>
                    </div>
                {/if}
                {#if !showAllPlatforms}
                    {#if curPlatform === "windows"}
                        <Button design="primary-filled" href={createVersionString("windows")}>
                            <Icon icon="windows" />Download for Windows
                        </Button>
                    {/if}
                    {#if curPlatform === "mac"}
                        <Button design="primary-filled" href={createVersionString("mac")}>
                            <Icon icon="mac" />Download for macOS
                        </Button>
                    {/if}
                    {#if curPlatform === "android"}
                        <Button design="primary-filled" href={createVersionString("android")}>
                            <Icon icon="android" />Download for Android
                        </Button>
                    {/if}
                    <!-- {#if curPlatform == "android"}
                <Button style="primary-filled">
                    <Icon icon="android"/>Download for Android (32 bit)
                </Button>
            {/if} -->
                {/if}
                <Rollover title="Show All Platforms" bind:open={showAllPlatforms}>
                    <Column align="stretch">
                        <Button design="primary-filled" href={createVersionString("windows")}>
                            <Icon icon="windows" />Download for Windows
                        </Button>
                        <Button design="primary-filled" href={createVersionString("mac")}>
                            <Icon icon="mac" />Download for macOS
                        </Button>
                        <Button design="primary-filled" href={createVersionString("android")}>
                            <Icon icon="android" />Download for Android
                        </Button>
                        <!-- <Button style="primary-filled">
                        <Icon icon="android"/>Download for Android (32 bit)
                    </Button> -->
                    </Column>
                </Rollover>
            </Column>
        </section>
    </Column>
</div>

<Gap size="large" />

<h2>How to install mods?</h2>

<FlyIntoView>
    <div class="img-with-width">
        <Image name="main-menu" alt="The main menu, showing the Geode button" style="shadow" />
    </div>
    <Column align="left">
        <p>
            Once you have <em>installed Geode</em>
            , you should see a new button in the bottom row of the main menu.
            <br />
            <br />
            Clicking this button brings you to the Geode Menu.
        </p>
        <Row wrap="wrap">
            <Button design="hollow" href="/faq#i-cant-see-the-geode-button">
                <Icon icon="help" /> I can't see the Geode button!
            </Button>
        </Row>
    </Column>
</FlyIntoView>

<FlyIntoView>
    <div class="img-with-width">
        <Image name="main-page" alt="The Geode menu" style="shadow" />
    </div>
    <Column align="left">
        <p>
            The first page you see is the <em>list of mods you currently have installed</em>
            . Use the toggles to quickly
            <em>enable/disable</em>
            any mods, or click
            <em>View</em>
            for further options like editing mod settings and uninstalling.
        </p>
        <Row wrap="wrap">
            <Button design="hollow" href="/faq#how-do-i-change-mod-settings">
                <Icon icon="help" /> How do I change mod settings?
            </Button>
            <Button design="hollow" href="/faq#how-do-i-update-mods">
                <Icon icon="help" /> How do I update mods?
            </Button>
            <Button design="hollow" href="/faq#how-do-i-uninstall-mods">
                <Icon icon="help" /> How do I uninstall mods?
            </Button>
        </Row>
    </Column>
</FlyIntoView>

<FlyIntoView>
    <div class="img-with-width">
        <Image name="download-page" alt="The download tab of the Geode menu" style="shadow" />
    </div>
    <Column align="left">
        <p>
            The other pages - <em>Recommended</em>
            ,
            <em>Download</em>
            , and
            <em>Trending</em>
            are dedicated to finding new mods.
            <br />
            <br />
            You can use the
            <em>search button</em>
            on the left to search for specific mods by name or by
            <em>tags</em>
            .
        </p>
        <Row wrap="wrap">
            <Button design="hollow" href="/faq#why-cant-i-find-certain-mods">
                <Icon icon="help" /> Why can't I find a certain Mod?
            </Button>
        </Row>
    </Column>
</FlyIntoView>

<Gap size="normal" />

<style lang="scss">
    @use "$lib/styles/media-queries.scss" as *;

    .img-with-width {
        max-width: 35vw;
        flex-shrink: 0;

        @include lt-lg {
            max-width: 65vw;
        }
    }
    section {
        background-color: var(--background-950);
        padding: 1rem;
        border-radius: 0.5rem;
    }
    h1 {
        margin: 0;
        font-family: var(--font-heading);
        font-weight: 600;
        color: var(--text-50);
        font-size: min(var(--font-size-title), 15vw);
    }
    h2 {
        margin: 0;
        font-family: var(--font-heading);
        font-weight: 600;
        color: var(--text-50);
        font-size: var(--font-size-heading);
    }
    em {
        font-weight: unset;
    }

    .installation {
        padding: 1rem;
    }
</style>
