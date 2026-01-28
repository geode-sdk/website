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
    import type { PageData } from "./$types";
    import { getNewGDUpdateWasReleased } from "$lib";
    import NewGDUpdateAlert from "$lib/components/NewGDUpdateAlert.svelte";
    import Markdown from "svelte-exmarkdown";
    import { Localized, useLocalize } from "@nubolab-ffwd/svelte-fluent";

    interface Props {
        data: PageData;
    }

    let { data }: Props = $props();

    const localize = useLocalize();

    // is this a bad pattern.
    let stats_promise: Promise<ServerStats> = $state(new Promise(() => {}));

    let recentGDUpdate = getNewGDUpdateWasReleased();

    onMount(async () => {
        const client = new IndexClient();
        stats_promise = client.getServerStats();
    });
</script>

<svelte:head>
    <title>{localize("home-meta-title")}</title>
    <meta name="description" content={localize("home-meta-desc")}/>
</svelte:head>

<Waves type="top-full" />
<div style="padding: 2rem">
    <Column>
        <Row wrap="wrap">
            <GeodeLogo type="plain-mono" />
            <h1><Localized id="home-title"/></h1>
        </Row>
        <span class="shadow">
            <Markdown
                md={localize("home-subtitle-tagline", {
                    gd: "[Geometry Dash](https://store.steampowered.com/app/322170/Geometry_Dash/)"
                })}
                --em-color="var(--accent-alt-300)"
                --text-color="var(--text-50)"
                --font-weight="600"
                --font-size="1.3rem"
                --link-weight="700"
            >
                {#snippet p(props)}
                    <!-- This is honestly a hack just to get the link to be aligned with the text -->
                    <p style="
                        display: flex;
                        flex-wrap: wrap;
                        flex-direction: row;
                        align-items: center;
                        gap: .5ch;
                    ">{@render props.children?.()}</p>
                {/snippet}
                {#snippet a(props)}
                    <Link
                        href={props.href!}
                        icon="gd"
                        --link-color="var(--accent-300)"
                    >{@render props.children?.()}</Link>
                {/snippet}
            </Markdown>
        </span>
        <Gap size="0" />
        {#if recentGDUpdate}
            <NewGDUpdateAlert/>
        {/if}
        <Row wrap="wrap">
            <Button href="/install" design="primary-filled-dark" icon="download">
                <Localized id="main-button-download"/>
            </Button>
            <Button href="/mods" design="primary-filled-dark" icon="browse">
                <Localized id="main-button-browse-mods"/>
            </Button>
            {#if data.self}
                <Button href="/developers" design="primary-filled-dark" icon="account">
                    <Localized id="main-button-developers"/>
                </Button>
            {/if}
            <Button href="/faq" design="primary-filled-dark" icon="help">
                <Localized id="main-button-faq"/>
            </Button>
        </Row>
    </Column>
</div>
<Image name="main-page" alt="The main page" style="shadow"></Image>

<Column>
    <Row wrap="wrap" --link-color="var(--secondary-300)">
        <Link href="https://discord.gg/9e43WMKzhp" icon="discord">
            <Localized id="links-discord"/>
        </Link>
        <Dot --dot-color="var(--background-400)" />
        <Link href="https://twitter.com/GeodeSDK" icon="twitter">
            <Localized id="links-twitter"/>
        </Link>
        <Dot --dot-color="var(--background-400)" />
        <Link href="https://bsky.app/profile/geode-sdk.org" icon="bluesky">
            <Localized id="links-bluesky"/>
        </Link>
    </Row>
    <Row wrap="wrap" --link-color="var(--secondary-300)">
        <Link href="https://docs.geode-sdk.org/" icon="docs">
            <Localized id="links-docs"/>
        </Link>
        <Dot --dot-color="var(--background-400)" />
        <Link href="https://github.com/geode-sdk" icon="github">
            <Localized id="links-source-code"/>
        </Link>
    </Row>
</Column>

<Column align="center">
    <FlyIntoView reverseOnSmallScreen={true}>
        <Column>
            <Markdown md={localize("home-showcase-introduction")}/>
            <span class="platform-icons">
                <Icon icon="windows" --icon-size="2.5em" />
                <Icon icon="mac" --icon-size="2.5em" />
                <Icon icon="android" --icon-size="2.5em" />
                <Icon icon="ios" --icon-size="2.5em" />
            </span>
        </Column>
        <ShowcaseCollage />
    </FlyIntoView>

    <FlyIntoView>
        <ModCollage />
        <Column>
            <Markdown md={localize("home-showcase-community")}/>
            <Row wrap="wrap">
                {#await stats_promise}
                    <LoadingCircle size="small" />
                    <p>Loading stats...</p>
                {:then stats}
                    <MoneyBox
                        icon="download"
                        text={localize("home-showcase-community.geode-download-count", {
                            download_count: stats.total_geode_downloads
                        })}
                    />
                    <MoneyBox
                        icon="graph"
                        text={localize("home-showcase-community.mods-published", {
                            mod_count: stats.total_mod_count
                        })}
                    />
                {:catch error}
                    <InfoBox type="error">Unable to load stats!</InfoBox>
                {/await}
            </Row>
        </Column>
    </FlyIntoView>

    <FlyIntoView reverseOnSmallScreen={true}>
        <Column>
            <Markdown md={localize("home-showcase-code")}/>
            <Row wrap="wrap">
                <Button href="https://docs.geode-sdk.org/" design="secondary-filled">
                    <Icon icon="docs" /><Localized id="links-docs"/>
                </Button>
                <Button href="https://github.com/geode-sdk/example-mod/">
                    <Icon icon="examples" /><Localized id="links-examples"/>
                </Button>
            </Row>
        </Column>
        <div class="code-example">
            <CodeExample
                code={`
                // ${localize("home-showcase-code.comment-include")}
                #include <Geode/modify/MenuLayer.hpp>
                
                using namespace geode::prelude;
                
                // ${localize("home-showcase-code.comment-modify")}
                class $modify(MenuLayer) {
                    // ${localize("home-showcase-code.comment-hook-init")}
                    bool init() {
                        // ${localize("home-showcase-code.comment-init-original")}
                        if (!MenuLayer::init())
                            return false;
                        
                        // ${localize("home-showcase-code.comment-comment-log")}
                        log::info("${localize("home-showcase-code.log-message")}");
                
                        return true;
                    }
                };
            `} />
        </div>
    </FlyIntoView>

    <FlyIntoView>
        <Column>
            <Markdown md={localize("home-showcase-get-started")}/>
            <Row wrap="wrap">
                <Button href="/install" design="primary-filled" icon="download">
                    <Localized id="main-button-download"/>
                </Button>
                <Button href="/mods" design="primary-filled" icon="browse">
                    <Localized id="main-button-browse-mods"/>
                </Button>
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
        text-shadow: 0 0 2rem var(--primary-800);
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
        text-shadow: 0 0 0.75rem var(--primary-800);
        & :global(.icon) {
            filter: drop-shadow(0px 0px 0.25rem var(--primary-800));
        }
    }
    span.platform-icons {
        display: flex;
        flex-direction: row;
        gap: 0.75rem;
        color: var(--accent-300);
        filter: drop-shadow(0px 0px 0.5rem color-mix(in srgb, var(--primary-500) 25%, transparent));
    }
</style>
