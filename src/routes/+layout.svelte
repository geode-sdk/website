<script lang="ts">
    import "../app.scss";
    import Button from "$lib/components/Button.svelte";
    import Column from "$lib/components/Column.svelte";
    import Row from "$lib/components/Row.svelte";
    import Link from "$lib/components/Link.svelte";
    import Dot from "$lib/components/Dot.svelte";
    import Waves from "$lib/components/Waves.svelte";
    import Icon from "$lib/components/Icon.svelte";
    import type { LayoutData } from "./$types";

    export let data: LayoutData;
</script>

<main>
    <div class="bg" />
    <div class="side-art left" />
    <div class="side-art right" />
    <slot />
    <nav>
        <div class="nav-left">
            <Button href=".." design="primary-filled-dark" icon="home">Home</Button>
            <Button href="/mods" design="primary-filled-dark" icon="browse">Mods</Button>
            <Button href="/faq" design="primary-filled-dark" icon="help">FAQ</Button>
        </div>
        {#if data.loggedInUser !== null}
            <div class="nav-right">
                <Button href="/me" design="primary-filled-dark" icon="account">{data.loggedInUser.username}</Button>
            </div>
        {/if}
        <slot name="nav" />
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
                    {#if data.loggedInUser === null}
                        <Dot />
                        <Link href="/login" icon="account">Login</Link>
                    {/if}
                </Row>
                <p>
                    Site made by <Link href="https://github.com/hjfod">HJfod</Link>. Thank you to <Link
                        href="https://github.com/nekitdev">
                        Nekit
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

        filter: drop-shadow(0px 0px 3rem color-mix(in srgb, var(--primary-700) 15%, transparent));
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
    }

    .waves-bottom {
        min-width: 100%;
    }
</style>
