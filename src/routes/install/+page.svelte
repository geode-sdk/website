<script>
    import Button from "$lib/components/Button.svelte";
    import Column from "$lib/components/Column.svelte";
    import FlyIntoView from "$lib/components/FlyIntoView.svelte";
    import Gap from "$lib/components/Gap.svelte";
    import Icon from "$lib/components/Icon.svelte";
    import Image from "$lib/components/Image.svelte";
    import Row from "$lib/components/Row.svelte";
    import Waves from "$lib/components/Waves.svelte";

    let latestVersion = "1.0.0";
    let showAllPlatforms = false;
    let curPlatform = "windows";
</script>

<Waves type="top" />
<Gap size="large" />

<h1>Install Geode</h1>

<span class="install-grid">
    <div>
        <Column>
            <span>Latest version: <em>{latestVersion}</em></span>
            <Column align="stretch">
                {#if showAllPlatforms || curPlatform == "windows"}
                    <Button style="primary-filled">
                        <Icon icon="windows"/>Download for Windows
                    </Button>
                {/if}
                {#if showAllPlatforms || curPlatform == "mac"}
                    <Button style="primary-filled">
                        <Icon icon="mac"/>Download for macOS
                    </Button>
                {/if}
                {#if showAllPlatforms || curPlatform == "android"}
                    <Button style="primary-filled">
                        <Icon icon="android"/>Download for Android
                    </Button>
                {/if}
                {#if showAllPlatforms || curPlatform == "android"}
                    <Button style="primary-filled">
                        <Icon icon="android"/>Download for Android (32 bit)
                    </Button>
                {/if}
            </Column>
            <p class="show-platforms" on:click={() => showAllPlatforms = !showAllPlatforms}>
                {showAllPlatforms ? "Hide platforms" : "Show all platforms"}
            </p>
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
    <div style="flex-shrink: 0">
        <Image name="main-menu" alt="The main menu, showing the Geode button" style="shadow"></Image>
    </div>
    <Column align="left">
        <p>
            Once you have <em>installed Geode</em>, you should see a new button in the bottom row of the main menu.
            <br>
            <br>
            Clicking this button brings you to the Geode Menu.
        </p>
        <Row wrap={true}>
            <Button style="hollow">
                <Icon icon="help"/> I can't see the Geode button!
            </Button>
        </Row>
    </Column>
</FlyIntoView>

<FlyIntoView>
    <div style="flex-shrink: 0">
        <Image name="main-page" alt="The Geode menu" style="shadow"></Image>
    </div>
    <Column align="left">
        <p>
            The first page you see is the <em>list of mods you currently have installed</em>.
            Use the toggles to quickly <em>enable/disable</em> any mods,
            or click <em>View</em> for further options like editing mod settings and uninstalling.
        </p>
        <Row wrap={true}>
            <Button style="hollow">
                <Icon icon="help"/> How do I change mod settings?
            </Button>
            <Button style="hollow">
                <Icon icon="help"/> How do I update mods?
            </Button>
            <Button style="hollow">
                <Icon icon="help"/> How do I uninstall mods?
            </Button>
        </Row>
    </Column>
</FlyIntoView>

<FlyIntoView>
    <div style="flex-shrink: 0">
        <Image name="download-page" alt="The download tab of the Geode menu" style="shadow"></Image>
    </div>
    <Column align="left">
        <p>
            The other pages - <em>Recommended</em>, <em>Download</em>, and <em>Trending</em> are dedicated to finding new mods.
            <br>
            <br>
            You can use the <em>search button</em> on the left to search for specific mods by name or by <em>tags</em>.
        </p>
        <Row wrap={true}>
            <Button style="hollow">
                <Icon icon="help"/> Why can't I find a certain Mod?
            </Button>
        </Row>
    </Column>
</FlyIntoView>

<Gap size="normal" />

<style lang="scss">
    .install-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        align-items: center;
        max-width: min(80ch, 90vw);
    }
    .show-platforms {
        cursor: pointer;
        color: var(--secondary-300);
        &:hover {
            text-decoration: underline;
        }
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