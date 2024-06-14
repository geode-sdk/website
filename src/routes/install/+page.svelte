<script lang="ts">
    import Button from "$lib/components/Button.svelte";
    import Column from "$lib/components/Column.svelte";
    import FlyIntoView from "$lib/components/FlyIntoView.svelte";
    import Gap from "$lib/components/Gap.svelte";
    import Icon from "$lib/components/Icon.svelte";
    import Image from "$lib/components/Image.svelte";
    import Rollover from "$lib/components/Rollover.svelte";
    import Row from "$lib/components/Row.svelte";
    import Waves from "$lib/components/Waves.svelte";

    let latestVersion = "TODO BEFORE RELEASE";
    let showAllPlatforms = false;
    let curPlatform = "windows";
</script>

<Waves type="top" />
<Gap size="large" />

<svelte:head>
    <title>Install Geode</title>
    <meta name="description" content="Install Geode on Windows, Android and MacOS">
</svelte:head>

<h1>Install Geode</h1>

<span class="install-grid">
    <div>
        <Column>
            <span>Latest version: <em>{latestVersion}</em></span>
            {#if !showAllPlatforms}
            {#if curPlatform == "windows"}
                <Button style="primary-filled">
                    <Icon icon="windows"/>Download for Windows
                </Button>
            {/if}
            {#if curPlatform == "mac"}
                <Button style="primary-filled">
                    <Icon icon="mac"/>Download for macOS
                </Button>
            {/if}
            {#if curPlatform == "android"}
                <Button style="primary-filled">
                    <Icon icon="android"/>Download for Android
                </Button>
            {/if}
            {#if curPlatform == "android"}
                <Button style="primary-filled">
                    <Icon icon="android"/>Download for Android (32 bit)
                </Button>
            {/if}
            {/if}
            <Rollover title="Show All Platforms" bind:open={showAllPlatforms}>
                <Button style="primary-filled">
                    <Icon icon="windows"/>Download for Windows
                </Button>
                <Button style="primary-filled">
                    <Icon icon="mac"/>Download for macOS
                </Button>
                <Button style="primary-filled">
                    <Icon icon="android"/>Download for Android
                </Button>
                <Button style="primary-filled">
                    <Icon icon="android"/>Download for Android (32 bit)
                </Button>
            </Rollover>
        </Column>
    </div>
    <Column align="left">
        <p><strong>Installation instructions</strong></p>
        <span style="color: var(--background-300)">
            <Column align="left">
                <Row>
                    <Icon icon="one"/>
                    <p>Download the <em>installer</em> for the platform you want.</p>
                </Row>
                <Row>
                    <Icon icon="two"/>
                    <p>Run the installer.</p>
                </Row>
            </Column>
        </span>
        <p>
            Geode is available for <em>Windows</em>, <em>MacOS</em> and <em>Android</em>.
        </p>
    </Column>
</span>

<Gap size="large" />

<h2>How to install mods?</h2>

<FlyIntoView>
    <div class="img-with-width">
        <Image
            name="main-menu" alt="The main menu, showing the Geode button"
            style="shadow"
        />
    </div>
    <Column align="left">
        <p>
            Once you have <em>installed Geode</em>, you should see a new button in the bottom row of the main menu.
            <br>
            <br>
            Clicking this button brings you to the Geode Menu.
        </p>
        <Row wrap="wrap">
            <Button style="hollow" href="/faq#i-cant-see-the-geode-button">
                <Icon icon="help"/> I can't see the Geode button!
            </Button>
        </Row>
    </Column>
</FlyIntoView>

<FlyIntoView>
    <div class="img-with-width">
        <Image
            name="main-page" alt="The Geode menu" 
            style="shadow"
        />
    </div>
    <Column align="left">
        <p>
            The first page you see is the <em>list of mods you currently have installed</em>.
            Use the toggles to quickly <em>enable/disable</em> any mods,
            or click <em>View</em> for further options like editing mod settings and uninstalling.
        </p>
        <Row wrap="wrap">
            <Button style="hollow" href="/faq#how-do-i-change-mod-settings">
                <Icon icon="help"/> How do I change mod settings?
            </Button>
            <Button style="hollow" href="/faq#how-do-i-update-mods">
                <Icon icon="help"/> How do I update mods?
            </Button>
            <Button style="hollow" href="/faq#how-do-i-uninstall-mods">
                <Icon icon="help"/> How do I uninstall mods?
            </Button>
        </Row>
    </Column>
</FlyIntoView>

<FlyIntoView>
    <div class="img-with-width">
        <Image
            name="download-page" alt="The download tab of the Geode menu"
            style="shadow"
        />
    </div>
    <Column align="left">
        <p>
            The other pages - <em>Recommended</em>, <em>Download</em>, and <em>Trending</em> are dedicated to finding new mods.
            <br>
            <br>
            You can use the <em>search button</em> on the left to search for specific mods by name or by <em>tags</em>.
        </p>
        <Row wrap="wrap">
            <Button style="hollow">
                <Icon icon="help"/> Why can't I find a certain Mod?
            </Button>
        </Row>
    </Column>
</FlyIntoView>

<Gap size="normal" />

<style lang="scss">
	@use '$lib/styles/media-queries.scss' as *;

    .img-with-width {
        max-width: 35vw;
        flex-shrink: 0;

		@include lt-lg {
            max-width: 65vw;
        }
    }
    .install-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        align-items: center;
        max-width: min(80ch, 90vw);
    }
    h1 {
        margin: 0;
        font-family: var(--font-heading);
        font-weight: 600;
        color: var(--text-50);
        font-size: var(--font-size-title);
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
</style>