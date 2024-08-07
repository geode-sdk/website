<script lang="ts">
	import type { PageData } from "./$types.js";
    import Button from "$lib/components/Button.svelte";
    import Column from "$lib/components/Column.svelte";
    import FlyIntoView from "$lib/components/FlyIntoView.svelte";
    import Gap from "$lib/components/Gap.svelte";
    import Icon from "$lib/components/Icon.svelte";
    import Image from "$lib/components/Image.svelte";
    import InfoBox from "$lib/components/InfoBox.svelte";
    import Link from "$lib/components/Link.svelte";
    import Rollover from "$lib/components/Rollover.svelte";
    import Row from "$lib/components/Row.svelte";
    import ModCard from "$lib/components/ModCard.svelte";
    import Waves from "$lib/components/Waves.svelte";
    import MoneyBox from "$lib/components/MoneyBox.svelte";
    import { getServerStats } from "$lib/api/index-repository";
    import LoadingCircle from "$lib/components/LoadingCircle.svelte";
    import { onMount } from "svelte";

    export let data: PageData;

    onMount(() => {
        //

        return () => {}
    });
</script>

<Waves type="top" />
<Gap size="large" />

<svelte:head>
    <title>Developer Dashboard</title>
    <meta name="description" content="The place for developers to do certain actions!">
</svelte:head>

<h2 class="title">Your Mods!</h2>

{#each data.mods as mod (mod.id)}
    {@const mod_version = mod.versions[0]}
    <ModCard
        mod={mod} version={mod_version}
        hideDescription
        hideVersion
        noLinkInVersion
        style='list'
    />
    <Row>
    {#each mod.versions as version}
    <ModCard
        mod={mod} version={version}
        versionDownloadCount
        hideDescription
        style='grid'
    />
    {/each}
    </Row>
{/each}


<style lang="scss">
	@use '$lib/styles/media-queries.scss' as *;
    .img-with-width {
        max-width: 35vw;
        flex-shrink: 0;

		@include lt-lg {
            max-width: 65vw;
        }
    }
    section {
        background-color: var(--background-950);
        padding: 1rem;
        border-radius: .5rem;
    }
    h1 {
        margin: 0;
        font-family: var(--font-heading);
        font-weight: 600;
        color: var(--text-50);
        font-size: min(var(--font-size-title), 15vw);
    }
    h2 {
        margin: 0;
        font-family: var(--font-heading);
        font-weight: 600;
        color: var(--text-50);
        font-size: var(--font-size-heading);
        &.title {
            font-size: min(var(--font-size-long-title), 15vw);
        }
    }
    em {
        font-weight: unset;
    }
    .dev-profile-picture {
        width: var(--icon-size);
        height: var(--icon-size);
        pointer-events: none;
        border-radius: 100%;
        transform: translate(8px, 20px) scale(0.60);
    }
    :global(.big-btn) {
        // when i do this, the bold text likes me and dont go to the end of the screen
        transform: translate(0,0);

        & > b {
            position: absolute;
            top: 5px;
            left: 10px;
            font-size: x-large;
        }
        & > p {
            position: absolute;
            bottom: 5px;
            left: 10px;
        }
        &:hover > p {
            position: absolute;
            bottom: 5px;
            left: 10px;
        }
    }
    :global(.big-btn .icon) {
        position: absolute;
        top: 20px;
        right: 22.5px;
        transform: scale(2.0);
    }
    :global(.big-btn.admin-btn) {
        grid-area: admin;
        transform: translateY(calc(50% + 25px));
    }
    .main-area {
        display: grid;
        grid-template-columns: 200px 200px;
        grid-template-rows: 100px 100px;
        gap: 50px;
        grid-template-areas: "profile update" "mods create";

        &:has(.admin-btn) {
            grid-template-areas: "profile update admin" "mods create .";
            grid-template-columns: 200px 200px 200px;
        }
    }

    :global(.main-area > .big-btn:nth-child(1)) {
        grid-area: profile;
    }
    :global(.main-area > .big-btn:nth-child(2)) {
        grid-area: update;
    }
    :global(.main-area > .big-btn:nth-child(3)) {
        grid-area: mods;
    }
    :global(.main-area > .big-btn:nth-child(4)) {
        grid-area: create;
    }
</style>