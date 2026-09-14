<script lang="ts">
    import "../app.css";
    import type { Snippet } from "svelte";
    import Button from "$lib/components/Button.svelte";
    import Column from "$lib/components/Column.svelte";
    import Row from "$lib/components/Row.svelte";
    import Link from "$lib/components/Link.svelte";
    import Dot from "$lib/components/Dot.svelte";
    import Waves from "$lib/components/Waves.svelte";
    import Icon from "$lib/components/Icon.svelte";
    import ProsperNewSession from "$lib/components/ProsperNewSession.svelte";
    import { adsOptedOut, privacyOptedOut, setPrivacyOptOut, trackingOptedOut } from "$lib/privacy";
    import { onMount } from "svelte";
    import type { LayoutData } from "./$types";
    import { setUserContext } from "$lib/context/user";
    import { env as publicEnv } from "$env/dynamic/public";

    interface Props {
        data: LayoutData;
        children?: Snippet;
        nav?: Snippet;
    }

    let { data, children, nav }: Props = $props();

    setUserContext(() => data.loggedInUser);
    const GID = publicEnv.PUBLIC_GTAG_ID ?? "";

    let privacyOff: boolean | undefined = $state();

    onMount(() => {
        privacyOff = privacyOptedOut();

        if (adsOptedOut() || data.loggedInUser) {
            return;
        }

        // load Venatus ad manager dynamically, only if the user didn't explicitly disable ads & tracking
        const script = document.createElement("script");
        script.async = true;
        script.src = "https://hb.vntsm.com/v4/live/vms/sites/geode-sdk.org/index.js";
        document.head.appendChild(script);
    });

    function togglePrivacy() {
        setPrivacyOptOut(!privacyOff);
        window.location.reload();
    }

    if (GID !== "" && !trackingOptedOut()) {
        onMount(() => {
            // <!-- Google tag (gtag.js) -->
            const script = document.createElement('script');
            script.async = true;
            script.src = `https://www.googletagmanager.com/gtag/js?id=${GID}`;
            document.head.appendChild(script);
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', GID);
        });
    }
</script>

<main>
    <ProsperNewSession />
    <div class="bg"></div>
    <div class="side-art left"></div>
    <div class="side-art right"></div>
    {@render children?.()}
    <nav>
        <div class="nav-left">
            <Button href=".." design="primary-filled-dark" icon="home">Home</Button>
            <Button href="/mods" design="primary-filled-dark" icon="browse">Mods</Button>
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
                    <Link href="https://discord.gg/9e43WMKzhp" icon="discord">Discord</Link>
                    <Dot />
                    <Link href="https://twitter.com/GeodeSDK" icon="twitter">Twitter</Link>
                    <Dot />
                    <Link href="https://bsky.app/profile/geode-sdk.org" icon="bluesky">Bluesky</Link>
                </Row>
                <Row wrap="wrap" align="center">
                    <Link href="https://docs.geode-sdk.org/" icon="docs">Documentation</Link>
                    <Dot />
                    <Link href="https://github.com/geode-sdk" icon="github">Source Code</Link>
                    <Dot />
                    <Link href="/privacy" icon="status">Privacy Policy</Link>
                    <!-- {#if privacyOff === false}
                        <Dot />
                        <button class="privacy-toggle" onclick={togglePrivacy} type="button">
                            <Icon icon="status" --icon-size="1.15em" />
                            Disable ads & tracking
                        </button>
                    {/if} -->
                    {#if data.loggedInUser === null}
                        <Dot />
                        <Link href="/login" icon="account">Login</Link>
                    {/if}
                </Row>
                <p>
                    Site made by <Link href="https://github.com/hjfod">HJfod</Link>. Thank you to <Link
                        href="https://github.com/nekitdev">
                        nekit
                    </Link> for the domain!
                </p>
                <Row gap="small">
                    <Icon icon="copyright" />
                    <p>Geode Team {new Date().getFullYear()}</p>
                </Row>
            </Column>
        </Waves>
    </div>
</main>

<style lang="css">
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

        &.left {
            left: 0;
            transform: scaleX(-1);
        }
        &.right {
            right: 0;
        }
    }
    @media screen and (min-width: 1280px) {
        .side-art {
            display: block;
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

    .privacy-toggle {
        background: none;
        border: none;
        padding: 0;
        cursor: pointer;
        font-weight: var(--link-weight, 700);
        font-size: var(--font-size);
        color: var(--link-color, var(--text-color));
        display: inline-flex;
        flex-direction: row;
        align-items: center;
        gap: var(--gap-small);

        &:hover {
            text-decoration: underline;
            color: var(--link-hover, var(--text-50));
        }
    }
</style>
