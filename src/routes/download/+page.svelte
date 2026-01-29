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
    import CodeExample from "$lib/components/CodeExample.svelte";
    import { bash } from "svelte-highlight/languages";
    import { getNewGDUpdateWasReleased } from "$lib";
    import NewGDUpdateAlert from "$lib/components/NewGDUpdateAlert.svelte";
    import Markdown from "svelte-exmarkdown";
    import { Localized, useLocalize } from "@nubolab-ffwd/svelte-fluent";

    interface Props {
        data: PageData;
    }

    let { data }: Props = $props();

    // Until server returns this, we're doing it manually
    let latestVersion = $derived(data.loader_tag);
    let latestLauncher = $derived(`v${data.launcher_tag}`);
    let latestIOSLauncher = $derived(`v${data.ios_launcher_tag}`);
    let showAllPlatforms = $state(false);
    let curPlatform: "windows" | "mac" | "android" | "linux" | "ios" | "unknown" | undefined = $state(undefined);

    let recentGDUpdate = getNewGDUpdateWasReleased();

    const localize = useLocalize();

    const copyLinuxScript = () => {
        navigator.clipboard.writeText("curl -o- 'https://geode-sdk.org/install/linux.sh' | bash");
    };

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
        }
        else if (window.navigator.userAgent.includes("Macintosh")) {
            curPlatform = "mac";
        }
        else if (window.navigator.userAgent.includes("Android")) {
            curPlatform = "android";
        }
        else if (window.navigator.userAgent.includes("Linux")) {
            curPlatform = "linux";
        }
        else if (window.navigator.userAgent.includes("iPhone") || window.navigator.userAgent.includes("iPad")) {
            curPlatform = "ios";
        }
        else {
            curPlatform = "unknown";
            showAllPlatforms = true;
        }
    });
</script>

<Waves type="top" />
<Gap size="large" />

<svelte:head>
    <title>{localize("download-meta-title")}</title>
    <meta name="description" content={localize("download-meta-desc")} />
</svelte:head>

<h1><Localized id="download-title"/></h1>

{#if recentGDUpdate?.geodeStatus === "fully-broken"}
    <NewGDUpdateAlert includeButton={false}/>
    <h2><Localized id="update-emergency-download-title"/></h2>
    <Markdown md={localize("update-emergency-download-text")}/>
{:else}
    <div class="installation">
        <Column>
            <section>
                <Column>
                    <p><strong><Localized id="download-instructions"/></strong></p>
                    <span style="color: var(--background-300)">
                        <Column align="start">
                            <Row>
                                <Icon icon="one" />
                                <Markdown md={localize("download-instructions.step-1")}/>
                            </Row>
                            <Row>
                                <Icon icon="two" />
                                <Markdown md={localize("download-instructions.step-2")}/>
                            </Row>
                        </Column>
                    </span>
                    <Markdown md={localize("download-instructions.platform-info")}/>
                </Column>
            </section>
            <section class:hidden={!data.error}>
                <InfoBox type="error">
                    <Markdown md={localize("download-fetch-failed")}/>
                </InfoBox>
            </section>
            <section class:hidden={data.error}>
                <Column>
                    {#if data.locales[0] !== "en"}
                        <InfoBox type="warning">
                            <Markdown md={localize("download-language-warning")}/>
                        </InfoBox>
                    {/if}
                    <div>
                        <Markdown md={localize("download-latest-version", { version: `*${latestVersion ?? "N/A"}*` })}/>
                    </div>
                    {#if curPlatform === "unknown"}
                        <Markdown md={localize("download-auto-detect-failed")}/>
                    {/if}
                    {#if curPlatform === "linux"}
                        <!-- epic hack to render the install container in the right place -->
                        <div class="alternative-install">
                            <Markdown md={localize("download-linux-info", {
                                linux_install_command: "`it-goes-here`"
                            })}>
                                {#snippet code()}
                                    <div class="linux-download-container">
                                        <CodeExample
                                            code={"curl -o- 'https://geode-sdk.org/install/linux.sh' | bash"}
                                            language={bash} />
                                        <Button icon={"clipboard"} onclick={copyLinuxScript} />
                                    </div>
                                {/snippet}
                            </Markdown>
                        </div>
                        <div>
                            <Button design="primary-filled" href={createVersionString("windows")}>
                                <Icon icon="linux" /><Localized id="download-for-linux"/>
                            </Button>
                        </div>
                        <p>
                            <Link bold href="faq#how-do-i-install-geode-on-linux">
                                <em><Localized id="download-linux-faq-link"/></em>
                            </Link>
                        </p>
                    {/if}
                    {#if curPlatform === "android"}
                        <Markdown md={localize("download-latest-android-version", { version: `*${latestLauncher ?? "N/A"}*` })}/>
                    {/if}
                    {#if curPlatform === "ios"}
                        <Markdown md={localize("download-ios-info")}/>
                        <Markdown md={localize("download-latest-ios-version", { version: `*${latestIOSLauncher ?? "N/A"}*` })}/>
                    {/if}
                    {#if !showAllPlatforms}
                        {#if curPlatform === "windows"}
                            <Button design="primary-filled" href={createVersionString("windows")}>
                                <Icon icon="windows"/><Localized id="download-for-windows"/>
                            </Button>
                        {/if}
                        {#if curPlatform === "mac"}
                            <InfoBox type="warning">
                                <Markdown md={localize("download-macos-info", {
                                    steam_link: "https://store.steampowered.com/app/322170/Geometry_Dash/"
                                })}/>
                            </InfoBox>

                            <Button design="primary-filled" href={createVersionString("mac")}>
                                <Icon icon="mac" /><Localized id="download-for-macos"/>
                            </Button>
                        {/if}
                        {#if curPlatform === "android"}
                            <Button design="primary-filled" href={createVersionString("android")}>
                                <Icon icon="android" /><Localized id="download-for-android"/>
                            </Button>
                        {/if}
                        {#if curPlatform === "ios"}
                            <Button
                                design="primary-filled"
                                href="https://github.com/geode-sdk/ios-launcher/blob/main/INSTALL.md">
                                <Icon icon="ios" /><Localized id="download-for-ios-experimental"/>
                            </Button>
                        {/if}
                    {/if}
                    <Rollover title={localize("download-show-all")} bind:open={showAllPlatforms}>
                        <Column align="stretch">
                            <Button design="primary-filled" href={createVersionString("windows")}>
                                <Icon icon="windows" /><Localized id="download-for-windows"/>
                            </Button>
                            <Button design="primary-filled" href={createVersionString("mac")}>
                                <Icon icon="mac" /><Localized id="download-for-macos-steam"/>
                            </Button>
                            <Button design="primary-filled" href={createVersionString("android")}>
                                <Icon icon="android" /><Localized id="download-for-android"/>
                            </Button>
                            <Button
                                design="primary-filled"
                                href="https://github.com/geode-sdk/ios-launcher/blob/main/INSTALL.md">
                                <Icon icon="ios" /><Localized id="download-for-ios-experimental"/>
                            </Button>
                        </Column>
                    </Rollover>
                </Column>
            </section>
        </Column>
    </div>

    <Gap size="large" />

    <h2><Localized id="download-how-to-use-mods-section-title"/></h2>

    <FlyIntoView>
        <div class="img-with-width">
            <Image name="main-menu" alt={localize("download-how-to-use-main-menu.image-alt")} style="shadow" />
        </div>
        <Column align="start">
            <Markdown md={localize("download-how-to-use-main-menu")}/>
            <Row wrap="wrap">
                <Button design="hollow" href="/faq#i-cant-see-geode-button">
                    <Icon icon="help" /><Localized id="download-how-to-use-main-menu.button-missing-faq"/>
                </Button>
            </Row>
        </Column>
    </FlyIntoView>

    <FlyIntoView>
        <div class="img-with-width">
            <Image name="main-page" alt={localize("download-how-to-use-mods-list.image-alt")} style="shadow" />
        </div>
        <Column align="start">
            <Markdown md={localize("download-how-to-use-mods-list")}/>
            <Row wrap="wrap" justify="start">
                <Button design="hollow" href="/faq#how-do-i-change-mod-settings">
                    <Icon icon="help" /><Localized id="download-how-to-use-mods-list.mod-settings-faq"/>
                </Button>
                <Button design="hollow" href="/faq#how-do-i-update-mods">
                    <Icon icon="help" /><Localized id="download-how-to-use-mods-list.mod-update-faq"/>
                </Button>
                <Button design="hollow" href="/faq#how-do-i-uninstall-mods">
                    <Icon icon="help" /><Localized id="download-how-to-use-mods-list.mod-uninstall-faq"/>
                </Button>
            </Row>
        </Column>
    </FlyIntoView>

    <FlyIntoView>
        <div class="img-with-width">
            <Image name="download-page" alt={localize("download-how-to-use-download-mods.image-alt")} style="shadow" />
        </div>
        <Column align="start">
            <Markdown md={localize("download-how-to-use-download-mods")}/>
            <Row wrap="wrap">
                <Button design="hollow" href="/faq#why-cant-i-find-certain-mods">
                    <Icon icon="help" /><Localized id="download-how-to-use-download-mods.cant-find-mod-faq"/>
                </Button>
            </Row>
        </Column>
    </FlyIntoView>
{/if}

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

    .alternative-install {
        text-align: center;
    }

    .linux-download-container {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
</style>
