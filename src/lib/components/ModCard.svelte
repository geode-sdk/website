<script lang="ts">
    import type { ServerMod } from "$lib/api/models/mod.js";
    import type { ServerModVersion } from "$lib/api/models/mod-version.js";
    import Link from "./Link.svelte";
    import Icon from "./Icon.svelte";
    import { serverTimestampToAgoString, abbreviateNumber, serverTimestampToDateString, formatNumber } from "$lib";

    import Label from "./Label.svelte";
    import ModLogo from "./ModLogo.svelte";
    import ModDevelopersList from "./ModDevelopersList.svelte";

    interface Props {
        mod: ServerMod;
        version: ServerModVersion;
        style?: "list" | "grid";
    }

    let { mod, version, style = "grid" }: Props = $props();

    // add the version for non-accepted mods, as otherwise the endpoint will pick the latest accepted
    let mod_url = $derived(
        version.status != "accepted" ? `/mods/${mod.id}?version=${version.version}` : `/mods/${mod.id}`,
    );

    const max_name_length = 32;
    const name = $derived(
        version.name.length > max_name_length ? version.name.slice(0, max_name_length) + "…" : version.name,
    );

    let paid = $derived(mod.tags.includes("paid"));
</script>

<div class="mod-background {style}" class:paid={paid && !mod.featured} class:featured={mod.featured}>
    {#if style === "list"}
        <div class="list-layout mod-card-horizontal-stack">
            <span class="click-to-go-to-page">
                <Link href={mod_url}>
                    <div class="mod-logo">
                        <ModLogo {mod} {version} />
                    </div>
                </Link>
            </span>
            <div class="mod-card-vertical-stack">
                <div>
                    <div class="click-to-go-to-page">
                        <Link href={mod_url}>
                            <div class="mod-card-horizontal-stack">
                                <h2 class="mod-name cutoff-name">{name}</h2>
                                {#if mod.featured}
                                    <Label icon="featured" design="accent-transparent" />
                                {/if}
                                {#if paid}
                                    <Label icon="tag-paid" design="accent-alt-transparent" />
                                {/if}
                            </div>
                        </Link>
                    </div>
                </div>
                <ModDevelopersList developers={mod.developers} full={false} />
                <p class="description" title={version.description || ""}>
                    {version.description ?? "Description not provided"}
                </p>
            </div>
            <div class="card-data-icons mod-card-vertical-stack" style="--mod-card-vertical-stack-justify: center">
                <div class="card-info | mod-card-horizontal-stack">
                    <Icon icon="version" />
                    <span>{version.version}</span>
                </div>
                <div class="card-info | mod-card-horizontal-stack" title={formatNumber(mod.download_count)}>
                    <Icon icon="download" />
                    <span>{abbreviateNumber(mod.download_count)}</span>
                </div>
                <div class="card-info | mod-card-horizontal-stack" title={serverTimestampToDateString(mod.updated_at)}>
                    <Icon icon="time" />
                    <span>{serverTimestampToAgoString(mod.updated_at)}</span>
                </div>
            </div>
        </div>
    {:else}
        <div class="grid-layout | mod-card-vertical-stack">
            <div>
                <span class="click-to-go-to-page">
                    <Link href={mod_url}>
                        <div class="mod-logo">
                            <ModLogo {mod} {version} />
                        </div>
                    </Link>
                </span>
            </div>
            <div style="max-width: 100%" title={name}>
                <span class="click-to-go-to-page">
                    <Link href={mod_url}>
                        <div class="mod-card-horizontal-stack" style="--mod-card-horizontal-stack-justify: center">
                            {#if mod.featured}
                                <Label icon="featured" design="accent-transparent" />
                            {/if}
                            {#if paid}
                                <Label icon="tag-paid" design="accent-alt-transparent" />
                            {/if}
                            <h2 class="mod-name | cutoff-name">{name}</h2>
                        </div>
                    </Link>
                </span>
            </div>
            <ModDevelopersList developers={mod.developers} full={false} />
            <div class="card-data-icons | mod-card-horizontal-stack">
                <div class="card-info | mod-card-horizontal-stack">
                    <Icon icon="version" />
                    <span>{version.version}</span>
                </div>
                <div class="card-info | mod-card-horizontal-stack" title={formatNumber(mod.download_count)}>
                    <Icon icon="download" />
                    <span>{abbreviateNumber(mod.download_count)}</span>
                </div>
            </div>
            <p class="description" title={version.description || ""}>
                {version.description ?? "Description not provided"}
            </p>
        </div>
    {/if}
</div>

<style>
    /* <utility-stuff> */

    .mod-card-vertical-stack {
        display: flex;
        flex-direction: column;
        justify-content: var(--mod-card-vertical-stack-justify, space-between);
        align-items: var(--mod-card-vertical-stack-align, stretch);
        gap: var(--mod-card-vertical-stack-gap, var(--gap-tiny));

        & > * {
            min-width: 0;
            min-height: 0;
        }
    }

    .mod-card-horizontal-stack {
        display: flex;
        justify-content: var(--mod-card-horizontal-stack-justify, flex-start);
        align-items: center;
        gap: var(--mod-card-horizontal-stack-gap, var(--gap-tiny));

        & > * {
            min-width: 0;
            min-height: 0;
        }
    }

    .cutoff-name {
        min-width: 0;
        max-width: 100%;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
    }

    .mod-name {
        margin: 0;
        font-size: 1.15em;
        font-family: var(--font-heading);
        text-align: center;
    }

    /* </utility-stuff> */

    .list-layout {
        --mod-card-horizontal-stack-justify: space-between;
        --mod-card-horizontal-stack-gap: var(--gap-normal);
        flex-grow: 2;

        /* make the title / dev / description column grow as much as it needs */
        & > :nth-child(2) {
            flex-grow: 2;
        }
        /* Prevent icon column from wrapping text */
        & > :last-child {
            flex-shrink: 0;
        }

        & .card-data-icons {
            --mod-card-horizontal-stack-gap: var(--gap-tiny);
            --mod-card-horizontal-stack-justify: flex-end;
        }
    }

    .grid-layout {
        --mod-card-vertical-stack-justify: space-between;
        --mod-card-vertical-stack-align: center;
        --mod-card-vertical-stack-gap: var(--gap-tiny);
        --description-line-count: 4;

        height: 100%;

        & > * {
            min-width: 0;
        }

        & .description {
            margin-block-start: auto;
        }
    }

    .description {
        font-size: 0.9em;
        color: var(--text-300);

        display: -webkit-box;
        -webkit-line-clamp: var(--description-line-count);
        line-clamp: var(--description-line-count);
        -webkit-box-orient: vertical;
        overflow: hidden;
    }

    .mod-background {
        --card-base-color: var(--background-500);
        --card-icon-base-color: var(--secondary-300);
        --card-icon-hover-color: var(--primary-300);

        --description-line-count: 2;

        background-color: color-mix(in srgb, var(--card-base-color) 15%, transparent);

        display: flex;
        align-items: center;
        justify-content: center;

        transition-duration: var(--transition-duration);

        padding: 1rem;
        border-radius: 0.5rem;

        &.featured {
            --card-base-color: var(--accent-500);
        }
        &.paid {
            --card-base-color: var(--accent-alt-500);
        }

        & > * {
            min-width: 0;
        }

        & :global(.icon) {
            --icon-size: 1.1em;
            color: var(--card-icon-base-color);
            transition-duration: var(--transition-duration);
        }

        &.grid {
            height: 18rem;
        }

        & .click-to-go-to-page {
            display: contents;

            & > :global(*) {
                flex-shrink: 0;
            }
        }
        &:has(:global(.click-to-go-to-page a:hover)) {
            background-color: color-mix(in srgb, var(--card-base-color) 40%, transparent);

            & h2 {
                color: var(--accent-300);
            }
            & :global(.icon) {
                color: var(--card-icon-hover-color);
            }
        }
    }
</style>
