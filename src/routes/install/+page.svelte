<script>
    import Button from "$lib/components/Button.svelte";
    import Column from "$lib/components/Column.svelte";
    import Icon from "$lib/components/Icon.svelte";
    import Row from "$lib/components/Row.svelte";

    let latestVersion = "1.0.0";
    let showAllPlatforms = false;
    let curPlatform = "windows";
</script>
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
                    <Icon --icon-size="1.3em" icon="one"/>
                    <p>Download the <em>installer</em> for the platform you want.</p>
                </Row>
                <Row>
                    <Icon --icon-size="1.3em" icon="two"/>
                    <p>Run the installer.</p>
                </Row>
            </Column>
        </span>
        <p>
            Geode is available for <em>Windows</em>, <em>MacOS</em> and <em>Android</em>.
        </p>
    </Column>
</span>

<style lang="scss">
    .install-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        align-items: center;
        max-width: min(80ch, 90vw);
    }
    .show-platforms {
        cursor: pointer;
        color: var(--text-300);
        &:hover {
            text-decoration: underline;
        }
    }
</style>