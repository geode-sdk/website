<script lang="ts">
    import "../app.scss";
    import { onMount } from "svelte";
    import { events, startEvents } from "$lib/events";
    import { page } from '$app/stores';
    import { getSelf } from "$lib/api/index-repository";
    import type { LayoutData } from './$types';
    import Button from "$lib/components/Button.svelte";
    import Column from "$lib/components/Column.svelte"
    import Row from "$lib/components/Row.svelte"
    import Link from "$lib/components/Link.svelte";
    import Dot from "$lib/components/Dot.svelte";
    import Gap from "$lib/components/Gap.svelte";
    import Waves from "$lib/components/Waves.svelte";
    import Icon from "$lib/components/Icon.svelte";

    export let data: LayoutData;

    let devProfileDropdown: HTMLDivElement

    function devProfileDropdownClick() {
        devProfileDropdown.classList.toggle("show")
    }

    function onLogOutClick() {
        data.loggedIn = false;
        data.self = undefined;
        let toFire = new CustomEvent("loggedout")
        events.dispatchEvent(toFire);
    }

    onMount(() => {
        startEvents(document);
        events.addEventListener("loggedin", async (e: Event) => {
            data.loggedIn = typeof (<CustomEvent>e).detail == "string";
            data.self = undefined;

            try {
                if (data.loggedIn) {
                    data.self = await getSelf(<string>(<CustomEvent>e).detail);
                }
            } catch (error) {
                console.log(`Unknown Error in +layout.svelte.js: ${error}`)
                data.loggedIn = false
            }
        });
    });
</script>

<main>
    <div class="bg"/>
    <div class="side-art left"/>
    <div class="side-art right"/>
    <slot/>
    <nav>
        <div class="left-side">
            <Button href="/" style="primary-filled-dark" icon="home">Home</Button>
            {#if $page.url.pathname.startsWith("/me/")}
            <Gap size="small" />
            <Button href="/me" style="secondary-filled-dark" icon="left">Profile</Button>
            {/if}
            {#if $page.url.pathname.startsWith("/dash/")}
            <Gap size="small" />
            <Button href="/dash" style="secondary-filled-dark" icon="left">Dashboard</Button>
            {/if}
            {#if $page.url.pathname.startsWith("/mods/")}
            <Gap size="small" />
            <Button href="/mods" style="secondary-filled-dark" icon="left">Mod Browser</Button>
            {/if}
        </div>
        <div class="right-side">
            {#if data.loggedIn && data.self}
            <div class="dropdown dev-profile" bind:this={devProfileDropdown}>
                <Button additional-classes="dropdown-display" style="primary-filled-dark" on:click={devProfileDropdownClick}>
                    <img src="https://github.com/{data.self.username}.png" alt="User Profile" class="nav-dev-profile-picture" />
                    {data.self.display_name}
                    <Icon  icon="down" />
                </Button>
                <Gap size="flex" />
                <div class="dropdown-content">
                    <Button href="/dash" style="primary-filled-dark">Dashboard</Button>
                    <Button style="primary-filled-dark">Mods (soon tm)</Button>
                    <Button href="/logout" style="primary-filled-dark" on:click={onLogOutClick} additional-classes="red">Log Out</Button>
                </div>
            </div>
            {/if}
        </div>
        <slot name="nav"/>
    </nav>
    <div class="waves-bottom">
        <Waves type="bottom" --text-color=var(--text-950)>
            <Column>
                <Row wrap="wrap" align="center">
                    <Link href="https://discord.gg/9e43WMKzhp" icon="discord">Discord</Link>
                    <Dot/>
                    <Link href="https://twitter.com/GeodeSDK" icon="twitter">Twitter</Link>
                    <Dot/>
                    <Link href="https://docs.geode-sdk.org/" icon="docs">Documentation</Link>
                    <Dot/>
                    <Link href="https://github.com/geode-sdk" icon="github">Source Code</Link>
                </Row>
                <p>
                    Site made by <Link href="https://github.com/hjfod">HJfod</Link>.
                    Thank you to <Link href="https://github.com/nekitdev">Nekit</Link> for the domain!
                </p>
                <Row gap=small>
                    <Icon icon="copyright"/> 
                    <p>Geode Team 2024</p>
                </Row>
            </Column>
        </Waves>
    </div>
</main>

<style lang="scss">
    @use '$lib/styles/media-queries.scss' as *;

    .bg {
        background-image: url("$lib/assets/bgart.png");
        background-size: contain;
        background-repeat: repeat-y;
        
        filter: blur(4px);

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
            left: 0px;
            transform: scaleX(-1);
        }
        &.right {
            right: 0px;
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
        position: fixed;
        top: 1rem;
        left: 1rem;

        & > div.left-side {
            position: fixed;
            top: 1rem;
            left: 1rem;
            display: flex;
            flex-direction: column;
        }
        & > div.right-side {
            position: fixed;
            top: 1rem;
            right: 1rem;
            display: flex;
            flex-direction: column;

            & > div.dropdown {
                & a .nav-dev-profile-picture {
                    width: var(--icon-size);
                    height: var(--icon-size);
                    pointer-events: none;
                    border-radius: 100%;
                }

                & > :global(a) :global(.icon) > :global(svg) {
                    transition: transform 500ms;
                }

                &:global(.show) > :global(a) :global(.icon) > :global(svg) {
                    transform: rotate(180deg);
                }

                & > :global(div.dropdown-content) {
                    display: flex;
                    flex-direction: column;
                    border-radius: .15rem;
                    border-style: solid;
                    border-width: .15rem;
                    background-color: var(--primary-950);
                    border-color: var(--primary-950);
                    box-shadow: 0px .1rem .5rem color-mix(in srgb, var(--primary-950) 50%, transparent);
                    transition: opacity .7s, transform .5s;
                    transform: translateY(1.2em);
                    opacity: 0;
                    pointer-events: none;
                }

                &:global(.show) > :global(div.dropdown-content) {
                    display: flex;
                    flex-direction: column;
                    transform: translateY(-1.2em);
                    opacity: 100%;
                    pointer-events: all;
                }
            }
        }
    }

    :global(.red) {
        color: rgb(190, 42, 42) !important;
    }

    .waves-bottom {
        min-width: 100%;
    }
</style>
