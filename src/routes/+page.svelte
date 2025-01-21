<script lang="ts">
    import Button from "$lib/components/Button.svelte";
    import Column from "$lib/components/Column.svelte";
    import Gap from "$lib/components/Gap.svelte";
    import GeodeLogo from "$lib/components/GeodeLogo.svelte";
    import Link from "$lib/components/Link.svelte";
    import Row from "$lib/components/Row.svelte";
    import Waves from "$lib/components/Waves.svelte";
    import Image from "$lib/components/Image.svelte";
    import Dot from "$lib/components/Dot.svelte";
    import FlyIntoView from "$lib/components/FlyIntoView.svelte";
    import Icon from "$lib/components/Icon.svelte";
    import CodeExample from "$lib/components/CodeExample.svelte";
    import ShowcaseCollage from "$lib/components/ShowcaseCollage.svelte";
    import ModCollage from "$lib/components/ModCollage.svelte";
    import MoneyBox from "$lib/components/MoneyBox.svelte";
    import LoadingCircle from "$lib/components/LoadingCircle.svelte";
    import InfoBox from "$lib/components/InfoBox.svelte";
    import { onMount } from "svelte";
    import { IndexClient } from "$lib/api/index-repository.js";
    import type { ServerStats } from "$lib/api/models/stats.js";

    // is this a bad pattern.
    let stats_promise: Promise<ServerStats> = new Promise(() => {});

    onMount(async () => {
        const client = new IndexClient();
        stats_promise = client.getServerStats();
    });
</script>

<svelte:head>
    <title>Geode - Mods for Geometry Dash</title>
    <meta name="description" content="Main page for Geode, the most popular mod loader for Geometry Dash">
</svelte:head>

<Waves type="top-full"/>
<div style="padding: 2rem">
    <Column>
        <Row wrap="wrap">
            <GeodeLogo type="plain-mono" />
            <h1>Geode</h1>
        </Row>
        <span class="shadow">
            <Row
                wrap="wrap"
                --em-color=var(--accent-alt-300)
                --text-color=var(--text-50)
                --font-weight=600
                --font-size=1.3rem
                --link-weight=700
                gap=small
            >
                <p>Bringing <em>mod support</em> to </p>
                <Link href="https://store.steampowered.com/app/322170/Geometry_Dash/" icon="gd" --link-color=var(--accent-300)>Geometry Dash</Link>
            </Row>
        </span>
        <Gap size="0"/>
        <Row>
            <Button href="/install" style="primary-filled-dark" icon="download">Download</Button>
            <Button href="/mods" style="primary-filled-dark" icon="browse">Browse Mods</Button>
        </Row>
    </Column>
</div>
<Image name="main-page" alt="The main page" style="shadow"></Image>

<Column>
	<Row wrap="wrap" --link-color=var(--secondary-300)>
	    <Link href="https://discord.gg/9e43WMKzhp" icon="discord">Discord</Link>
	    <Dot --dot-color="var(--background-400)"/>
	    <Link href="https://twitter.com/GeodeSDK" icon="twitter">Twitter</Link>
	    <Dot --dot-color="var(--background-400)"/>
	    <Link href="https://bsky.app/profile/geode-sdk.org" icon="bluesky">Bluesky</Link>
	</Row>
	<Row wrap="wrap" --link-color=var(--secondary-300)>
	    <Link href="https://docs.geode-sdk.org/" icon="docs">Documentation</Link>
	    <Dot --dot-color="var(--background-400)"/>
	    <Link href="https://github.com/geode-sdk" icon="github">Source Code</Link>
	</Row>
</Column>

<Column align="center">
    <FlyIntoView reverseOnSmallScreen={true}>
        <Column>
            <p>
                Geode is a <em>fan-made extension</em> for Geometry Dash that adds <em>mod support</em> to the game. 
                Browse from an in-game list to seamlessly download mods on <em>Windows</em>, <em>Mac</em>, 
                and <em>Android</em>!
            </p>
            <span class="platform-icons">
                <Icon icon="windows" --icon-size=2.5em />
                <Icon icon="mac" --icon-size=2.5em />
                <Icon icon="android" --icon-size=2.5em />
                <!--No iOS yet ;)-->
                <!-- <Icon icon="ios" --icon-size=2.5em /> -->
            </span>
        </Column>
        <ShowcaseCollage/>
    </FlyIntoView>

    <FlyIntoView>
        <ModCollage/>
        <Column>
            <p>
                Geode is the <em>most popular</em> GD mod loader across all platforms. With an <em>active community</em> of 
                both users and modders, nearly every mod you can imagine has been made or suggested!
            </p>
            <Row wrap="wrap">
                {#await stats_promise}
                    <LoadingCircle size="small"/><p>Loading stats...</p>
                {:then stats} 
                    <MoneyBox num={stats.total_geode_downloads} icon="download" text="downloads" />
                    <MoneyBox num={stats.total_mod_count} icon="graph" text="mods published" />
                {:catch error}
                    <InfoBox type="error">Unable to load stats!</InfoBox>
                {/await}
            </Row>
        </Column>
    </FlyIntoView>

    <FlyIntoView reverseOnSmallScreen={true}>
        <Column>
            <p>
                Geode is <em>open-source</em> and is designed to make the modding experience infinitely smoother for 
                developers. Geode comes with a <em>special hooking syntax</em> as well as dozens of built-in 
                <em>UI components</em>, <em>utility functions</em>, and everything else needed to make mods.
            </p>
            <Row wrap="wrap">
                <Button href="https://docs.geode-sdk.org/" style="secondary-filled">
                    <Icon icon="docs"/>Documentation
                </Button>
                <Button href="https://github.com/geode-sdk/example-mod/">
                    <Icon icon="examples"/>Examples
                </Button>
            </Row>
        </Column>
        <div class="code-example">
            <CodeExample code={`
                // Include Geode headers
                #include <Geode/modify/MenuLayer.hpp>
                
                using namespace geode::prelude;
                
                // Add hooks to the main menu
                class $modify(MenuLayer) {
                    // Override the main menu creation
                    bool init() {
                        // Start off by creating the original main menu
                        if (!MenuLayer::init())
                            return false;
                        
                        // We are now modding!
                        log::info("Hi from my mod!");
                
                        return true;
                    }
                };
            `} />
        </div>
    </FlyIntoView>

    <FlyIntoView>
        <Column>
            <p>
                Interested? Go to the <em>Installation Page</em> to download Geode for your device, or the 
                <em>Mods Browser</em> to view what mods Geode has to offer!
            </p>
            <Row wrap="wrap">
                <Button href="/install" style="primary-filled" icon="download">Install</Button>
                <Button href="/mods" style="primary-filled" icon="browse">Browse Mods</Button>
            </Row>
        </Column>
    </FlyIntoView>
</Column>

<style lang="scss">
    h1 {
        margin: 0;
        font-family: var(--font-heading);
        font-weight: 600;
        color: var(--text-50);
        font-size: var(--font-size-title);
        text-shadow: 0px 0px 2rem var(--primary-800);
    }
    .code-example {
        display: none;
    }

    @media screen and (min-width: 470px) {
        .code-example {
            display: block;
        }
    }

    .shadow {
        text-shadow: 0px 0px .75rem var(--primary-800);
        & :global(.icon) {
            filter: drop-shadow(0px 0px .25rem var(--primary-800));
        }
    }
	span.platform-icons {
		display: flex;
		flex-direction: row;
		gap: .75rem;
		color: var(--accent-300);
        filter: drop-shadow(0px 0px .5rem color-mix(in srgb, var(--primary-500) 25%, transparent));
	}
</style>
