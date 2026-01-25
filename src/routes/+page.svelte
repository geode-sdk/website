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
    import { m, main_button_download } from "$lib/paraglide/messages";
    import Markdown from "svelte-exmarkdown";

    interface Props {
        data: PageData;
    }

    let { data }: Props = $props();

    // is this a bad pattern.
    let stats_promise: Promise<ServerStats> = $state(new Promise(() => {}));

    let recentGDUpdate = getNewGDUpdateWasReleased();

    onMount(async () => {
        const client = new IndexClient();
        stats_promise = client.getServerStats();
    });
</script>

<svelte:head>
    <title>{m.meta_homepage_title()}</title>
    <meta name="description" content={m.meta_homepage_desc()}/>
</svelte:head>

<Waves type="top-full" />
<div style="padding: 2rem">
    <Column>
        <Row wrap="wrap">
            <GeodeLogo type="plain-mono" />
            <h1>{m.main_title()}</h1>
        </Row>
        <span class="shadow">
            <Markdown
                md={m.subtitle_tagline({
                    gd_link: "[Geometry Dash](https://store.steampowered.com/app/322170/Geometry_Dash/)"
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
                {m.main_button_download()}
            </Button>
            <Button href="/mods" design="primary-filled-dark" icon="browse">
                {m.main_button_browse_mods()}
            </Button>
            {#if data.self}
                <Button href="/developers" design="primary-filled-dark" icon="account">
                    {m.main_button_developers()}
                </Button>
            {/if}
            <Button href="/faq" design="primary-filled-dark" icon="help">
                {m.main_button_faq()}
            </Button>
        </Row>
    </Column>
</div>
<Image name="main-page" alt="The main page" style="shadow"></Image>

<Column>
    <Row wrap="wrap" --link-color="var(--secondary-300)">
        <Link href="https://discord.gg/9e43WMKzhp" icon="discord">
            {m.links_discord()}
        </Link>
        <Dot --dot-color="var(--background-400)" />
        <Link href="https://twitter.com/GeodeSDK" icon="twitter">
            {m.links_twitter()}
        </Link>
        <Dot --dot-color="var(--background-400)" />
        <Link href="https://bsky.app/profile/geode-sdk.org" icon="bluesky">
            {m.links_bluesky()}
        </Link>
    </Row>
    <Row wrap="wrap" --link-color="var(--secondary-300)">
        <Link href="https://docs.geode-sdk.org/" icon="docs">
            {m.links_docs()}
        </Link>
        <Dot --dot-color="var(--background-400)" />
        <Link href="https://github.com/geode-sdk" icon="github">
            {m.links_source_code()}
        </Link>
    </Row>
</Column>

<Column align="center">
    <FlyIntoView reverseOnSmallScreen={true}>
        <Column>
            <Markdown md={m.showcase_introduction()}/>
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
            <Markdown md={m.showcase_popular()}/>
            <Row wrap="wrap">
                {#await stats_promise}
                    <LoadingCircle size="small" />
                    <p>Loading stats...</p>
                {:then stats}
                    <MoneyBox
                        icon="download"
                        text={m.showcase_popular_download_count({
                            download_count: stats.total_geode_downloads
                        })}
                    />
                    <MoneyBox
                        icon="graph"
                        text={m.showcase_popular_mods_published({
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
            <Markdown md={m.showcase_code()}/>
            <Row wrap="wrap">
                <Button href="https://docs.geode-sdk.org/" design="secondary-filled">
                    <Icon icon="docs" />{m.links_docs()}
                </Button>
                <Button href="https://github.com/geode-sdk/example-mod/">
                    <Icon icon="examples" />{m.links_examples()}
                </Button>
            </Row>
        </Column>
        <div class="code-example">
            <CodeExample
                code={`
                // ${m.showcase_code_comment_include()}
                #include <Geode/modify/MenuLayer.hpp>
                
                using namespace geode::prelude;
                
                // ${m.showcase_code_comment_modify()}
                class $modify(MenuLayer) {
                    // ${m.showcase_code_comment_hook_init()}
                    bool init() {
                        // ${m.showcase_code_comment_init_orig()}
                        if (!MenuLayer::init())
                            return false;
                        
                        // ${m.showcase_code_comment_log()}
                        log::info("${m.showcase_code_log_message()}");
                
                        return true;
                    }
                };
            `} />
        </div>
    </FlyIntoView>

    <FlyIntoView>
        <Column>
            <Markdown md={m.showcase_get_started()}/>
            <Row wrap="wrap">
                <Button href="/install" design="primary-filled" icon="download">
                    {m.main_button_download()}
                </Button>
                <Button href="/mods" design="primary-filled" icon="browse">
                    {m.main_button_browse_mods()}
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
