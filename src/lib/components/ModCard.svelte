<script lang="ts">
    import type { ServerMod } from "$lib/api/models/mod.js";
    import type { ServerModVersion } from "$lib/api/models/mod-version.js";
    import { IndexClient } from "$lib/api/index-repository";
    import Link from "./Link.svelte";
    import Gap from "./Gap.svelte";
    import Row from "./Row.svelte";
    import Icon from "./Icon.svelte";
    import Column from "./Column.svelte";
    import {
        serverTimestampToAgoString,
        abbreviateNumber,
        serverTimestampToDateString,
        formatNumber,
    } from "$lib";
    import iconPlaceholder from "$lib/assets/icon-placeholder.png";
    import Label from "./Label.svelte";

    export let mod: ServerMod;
    export let version: ServerModVersion;
    export let style: "list" | "grid" = "grid";

    // add the version for non-accepted mods, as otherwise the endpoint will pick the latest accepted
    $: mod_url =
        version.status != "accepted"
            ? `/mods/${mod.id}?version=${version.version}`
            : `/mods/${mod.id}`;

    $: logo_url = IndexClient.getModLogo(mod.id).toString();

    $: owner = mod.developers.filter((d) => d.is_owner)[0];
    $: paid = mod.tags.includes("paid");
</script>

<div
    class="mod-background {style}"
    class:paid={paid && !mod.featured}
    class:featured={mod.featured}>
    {#if style === "list"}
        <div class="left">
            <span class="click-to-go-to-page">
                <Link href={mod_url} centered={true}>
                    <object
                        type="image/png"
                        data={logo_url}
                        title={`Logo for the mod ${version.name}`}
                        class="mod-image">
                        <img
                            src={iconPlaceholder}
                            alt={`Placeholder logo for the mod ${version.name}`}
                            class="mod-image" />
                    </object>
                </Link>
            </span>
            <Gap size="normal" />
            <Column align="left" gap="tiny">
                <span class="click-to-go-to-page">
                    <Link href={mod_url}>
                        <span class="title-container">
                            <h1 class:small={version.name.length > 16}>
                                {version.name}
                            </h1>
                            {#if mod.featured}
                                <Label
                                    icon="featured"
                                    style="accent-transparent" />
                            {/if}
                            {#if paid}
                                <Label
                                    icon="tag-paid"
                                    style="accent-alt-transparent" />
                            {/if}
                        </span>
                    </Link>
                </span>
                <Link
                    href={`/mods?developer=${owner.username}`}
                    --link-color="var(--accent-300)">
                    {owner.display_name}
                </Link>
                <p class="description" title={version.description || ""}>
                    {#if version.description}
                        {#if version.description?.length < 110}
                            {version.description}
                        {:else}
                            {version.description.substring(0, 110)}&#8230;
                        {/if}
                    {:else}
                        <i>{"Description not provided"}</i>
                    {/if}
                </p>
            </Column>
        </div>
        <span class="do-not-shrink right">
            <Column align="right" gap="tiny">
                <span class="card-info">
                    <Icon icon="version" />{version.version}
                </span>
                <span
                    class="card-info"
                    title={formatNumber(mod.download_count)}>
                    <Icon icon="download" />{abbreviateNumber(
                        mod.download_count,
                    )}
                </span>
                <span
                    class="card-info"
                    title={serverTimestampToDateString(mod.updated_at)}>
                    <Icon icon="time" />{serverTimestampToAgoString(
                        mod.updated_at,
                    )}
                </span>
            </Column>
        </span>
    {:else}
        <span class="click-to-go-to-page">
            <Column gap="small">
                <Link href={mod_url}>
                    <span class="title-container">
                        {#if mod.featured}
                            <Label icon="featured" style="accent-transparent" />
                        {/if}
                        {#if paid}
                            <Label
                                icon="tag-paid"
                                style="accent-alt-transparent" />
                        {/if}
                        <h1 class:small={version.name.length > 16}>
                            {version.name}
                        </h1>
                    </span>
                </Link>
                <Link href={mod_url} centered={true}>
                    <object
                        type="image/png"
                        data={logo_url}
                        title={`Logo for the mod ${version.name}`}
                        style="max-height: 6rem;">
                        <img
                            src={iconPlaceholder}
                            alt={`Placeholder logo for the mod ${version.name}`}
                            style="max-height: 6rem;" />
                    </object>
                </Link>
            </Column>
        </span>
        <Link
            href={`/mods?developer=${owner.username}`}
            --link-color="var(--accent-300)">
            {owner.display_name}
        </Link>
        <Gap size="small" />
        <Row>
            <span class="card-info">
                <Icon icon="version" />{version.version}
            </span>
            <span class="card-info" title={formatNumber(mod.download_count)}>
                <Icon icon="download" />{abbreviateNumber(mod.download_count)}
            </span>
        </Row>
        <Gap size="tiny" />
        <p class="description" title={version.description || ""}>
            {#if version.description}
                {#if version.description?.length < 80}
                    {version.description}
                {:else}
                    {version.description.substring(0, 80)}&#8230;
                {/if}
            {:else}
                <i>{"Description not provided"}</i>
            {/if}
        </p>
    {/if}
</div>

<style lang="scss">
    .title-container {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;

        h1 {
            margin: 0;
            font-size: 1.35em;
            font-family: var(--font-heading);
            text-align: center;

            &.small {
                font-size: 1.05em;
            }
        }
    }
    .description {
        font-size: 0.9em;
        color: var(--text-300);
        flex-grow: 1;

        display: -webkit-box;
        max-width: 200px;
        -webkit-line-clamp: 2;
        line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }

    .mod-image {
       	height: 336px;
       	width: 336px;
       	max-height: 5rem;
       	max-width: 5rem;
    }

    .mod-background.featured {
        --card-base-color: var(--accent-500);
    }

    .mod-background.paid {
        --card-base-color: var(--accent-alt-500);
    }

    .mod-background {
        --card-base-color: var(--background-500);
        --card-icon-base-color: var(--secondary-300);
        --card-icon-hover-color: var(--primary-300);

        background-color: color-mix(
            in srgb,
            var(--card-base-color) 15%,
            transparent
        );

        display: flex;
        align-items: center;

        transition-duration: var(--transition-duration);

        padding: 1rem;
        border-radius: 0.5rem;

        &.grid {
            height: 18rem;
            width: 12rem;
            flex-direction: column;
            justify-content: center;

            .description {
                -webkit-line-clamp: 4;
                line-clamp: 4;
            }
        }
        &.list {
            flex-direction: row;
            justify-content: space-between;

            .left {
                display: flex;
            }

            .right {
                display: none;
            }

            @media screen and (min-width: 450px) {
                .right {
                    display: flex;
                }
            }

            .title-container h1 {
                text-align: left;
            }
        }

        & .click-to-go-to-page {
            display: contents;

            & > :global(*) {
                flex-shrink: 0;
            }

            & object {
                transition-duration: var(--transition-duration);
                pointer-events: none;
            }
        }
        &:has(.click-to-go-to-page a:hover) {
            background-color: color-mix(
                in srgb,
                var(--card-base-color) 40%,
                transparent
            );

            & .click-to-go-to-page object {
                transform: scale(110%);
            }
            & h1 {
                color: var(--accent-300);
            }
            & :global(.icon):not(.title-container *) {
                color: var(--card-icon-hover-color);
            }
        }
    }
    .card-info {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 0.25em;

        & :global(.icon) {
            --icon-size: 1.1em;
            color: var(--card-icon-base-color);
            transition-duration: var(--transition-duration);
        }
    }
    .do-not-shrink {
        flex-shrink: 0;
    }
</style>
