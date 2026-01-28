<script lang="ts">
    import "../app.scss";
    import type { Snippet } from "svelte";
    import Button from "$lib/components/Button.svelte";
    import Column from "$lib/components/Column.svelte";
    import Row from "$lib/components/Row.svelte";
    import Link from "$lib/components/Link.svelte";
    import Dot from "$lib/components/Dot.svelte";
    import Waves from "$lib/components/Waves.svelte";
    import Icon from "$lib/components/Icon.svelte";
    import type { LayoutData } from "./$types";
    import Markdown from "svelte-exmarkdown";
	import { setSvelteFluent, Localized, useLocalize } from '@nubolab-ffwd/svelte-fluent';
    import Select from "$lib/components/Select.svelte";
    import { getAvailableLocales } from "$lib/translations/fluent";
    import SelectOption from "$lib/components/SelectOption.svelte";
    import { page } from "$app/state";
    import { goto } from "$app/navigation";

    const { data, children, nav }: {
        data: LayoutData;
        children?: Snippet;
        nav?: Snippet;
    } = $props();

    setSvelteFluent(() => data.fluent);
    const localize = useLocalize();
</script>

<main>
    <div class="bg"></div>
    <div class="side-art left"></div>
    <div class="side-art right"></div>
    {@render children?.()}
    <nav>
        <div class="nav-left">
            <Button href=".." design="primary-filled-dark" icon="home">
                <Localized id="nav-home"/>
            </Button>
            <Button href="/mods" design="primary-filled-dark" icon="browse">
                <Localized id="nav-mods"/>
            </Button>
            <Select
                titleIcon="lang"
                select={opt => {
                    let query = new URLSearchParams(page.url.searchParams)
                    query.set("lang", opt);
                    goto(`?${query}`, { invalidateAll: true });
                }}
                runSelectOnDefault={false}
            >
                {#each getAvailableLocales() as lang}
                    {@const getLanguageName = new Intl.DisplayNames([lang], { type: "language" })}
                    <SelectOption
                        icon="lang"
                        title={getLanguageName.of(lang) ?? lang}
                        value={lang}
                        isDefault={lang === data.locale}
                    />
                {/each}
            </Select>
        </div>
        {#if data.loggedInUser !== null}
            <div class="nav-right">
                <Button href="/me" design="primary-filled-dark" icon="account">{data.loggedInUser.username}</Button>
            </div>
        {/if}
        {@render nav?.()}
    </nav>
    <div class="waves-bottom">
        <Waves type="bottom" --text-color="var(--text-950)">
            <Column>
                <Row wrap="wrap" align="center">
                    <Link href="https://discord.gg/9e43WMKzhp" icon="discord">
                        <Localized id="links-discord"/>
                    </Link>
                    <Dot />
                    <Link href="https://twitter.com/GeodeSDK" icon="twitter">
                        <Localized id="links-twitter"/>
                    </Link>
                    <Dot />
                    <Link href="https://bsky.app/profile/geode-sdk.org" icon="bluesky">
                        <Localized id="links-bluesky"/>
                    </Link>
                </Row>
                <Row wrap="wrap" align="center">
                    <Link href="https://docs.geode-sdk.org/" icon="docs">
                        <Localized id="links-docs"/>
                    </Link>
                    <Dot />
                    <Link href="https://github.com/geode-sdk" icon="github">
                        <Localized id="links-source-code"/>
                    </Link>
                    {#if data.loggedInUser === null}
                        <Dot />
                        <Link href="/login" icon="account">
                            <Localized id="links-login"/>
                        </Link>
                    {/if}
                </Row>
                <Localized id="footer-credits">
                    <Markdown md={localize("footer-credits")}>
                        {#snippet a(props)}
                            <Link href={props.href!}>{@render props.children?.()}</Link>
                        {/snippet}
                    </Markdown>
                </Localized>
                <Row gap="small">
                    <Icon icon="copyright" />
                    <p>Geode Team {new Date().getFullYear()}</p>
                </Row>
            </Column>
        </Waves>
    </div>
</main>

<style lang="scss">
    @use "$lib/styles/media-queries.scss" as *;

    .bg {
        background-image: url("$lib/assets/bgart-blur.png");
        background-size: contain;
        background-repeat: repeat-y;

        position: absolute;
        z-index: -11;
        width: 100%;
        opacity: 15%;
        top: 0;
        bottom: 0;
    }
    .side-art {
        position: absolute;
        z-index: -10;
        width: 11rem;
        top: 0;
        bottom: 0;

        background-image: url("$lib/assets/sideart.png");
        background-size: contain;
        background-repeat: repeat-y;

        opacity: 50%;

        display: none;
        @include gt-md {
            display: block;
        }

        &.left {
            left: 0;
            transform: scaleX(-1);
        }
        &.right {
            right: 0;
        }
    }
    main {
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
        gap: var(--gap-large);
        padding-top: 4rem;
        min-height: 100vh;
    }
    nav {
        --fixed-margin: 1rem;
        position: fixed;
        top: var(--fixed-margin);
        left: 0;
        right: 0;
        padding-inline: var(--fixed-margin);

        display: flex;
        justify-content: space-between;
    }

    nav > * {
        display: flex;
        gap: 1rem;
        flex-wrap: wrap;
        align-items: center;
        flex-direction: column;
    }

    @media (min-width: 540px) {
        nav > * {
            flex-direction: row;
        }
    }

    .waves-bottom {
        min-width: 100%;
    }
</style>
