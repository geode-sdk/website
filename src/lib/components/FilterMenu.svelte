<script lang="ts">
    import Icon from "$lib/components/Icon.svelte";
    import Rollover from "$lib/components/Rollover.svelte";
    import SelectButton from "$lib/components/SelectButton.svelte";
    import InfoBox from "$lib/components/InfoBox.svelte";
    import LoadingCircle from "$lib/components/LoadingCircle.svelte";

    import { iconForTag, platformIDToLegible } from "$lib/index.js";
    import type { ServerTag } from "$lib/api/models/base";
    import { Localized, useLocalize } from "@nubolab-ffwd/svelte-fluent";

    function toggleSet<T>(set: Set<T>, value: T) {
        set.has(value) ? set.delete(value) : set.add(value);
    }

    const localize = useLocalize();

    interface Props {
        platforms: Set<string>;
        tags: Set<string>;
        tagsListing: Promise<ServerTag[]> | undefined;
        loggedIn: boolean;
        featured: boolean;
        pending: boolean;
        userMods: boolean;
        update: () => void;
    }

    let {
        platforms = $bindable(),
        tags = $bindable(),
        tagsListing,
        loggedIn,
        featured = $bindable(),
        pending = $bindable(),
        userMods = $bindable(),
        update,
    }: Props = $props();

    const updateSearch = () => {
        update();
    };
</script>

<div class="menu">
    <header><Icon icon="filter" --icon-size="1.2em" />
        <Localized id="browser-filters-title"/>
    </header>
    <nav>
        {#if loggedIn}
            <Rollover title={localize("browser-filters-category-developer")}>
                <SelectButton
                    icon="account"
                    selected={userMods}
                    select={() => {
                        userMods = !userMods;
                        updateSearch();
                    }}>
                    <Localized id="browser-filters-developer-own-only"/>
                </SelectButton>
            </Rollover>
        {/if}
        <Rollover title={localize("browser-filters-category-platform")}>
            {#each ["windows", "mac-arm", "mac-intel", "android64", "android32", "ios"] as platform}
                <SelectButton
                    icon="windows"
                    selected={platforms.has(platform)}
                    select={() => {
                        toggleSet(platforms, platform);
                        updateSearch();
                    }}>
                    {platformIDToLegible(platform)}
                </SelectButton>
            {/each}
        </Rollover>

        <Rollover title={localize("browser-filters-category-tags")}>
            {#await tagsListing}
                <LoadingCircle size="small" />
            {:then server_tags}
                {#if server_tags}
                    {#each server_tags as tag}
                        <SelectButton
                            icon={iconForTag(tag.name)}
                            selected={tags.has(tag.name)}
                            select={() => {
                                toggleSet(tags, tag.name);
                                updateSearch();
                            }}>
                            {tag.display_name}
                        </SelectButton>
                    {/each}
                {:else}
                    <InfoBox type="error">
                        <Localized id="browser-filters-category-tags.list-error"/>
                    </InfoBox>
                {/if}
            {:catch error}
                <InfoBox type="error">
                    <Localized id="browser-filters-category-tags.server-error"/>
                </InfoBox>
            {/await}
        </Rollover>

        <Rollover title={localize("browser-filters-category-other")}>
            <SelectButton icon="featured" bind:selected={featured} select={updateSearch}>
                <Localized id="browser-filters-featured-only"/>
            </SelectButton>
            <SelectButton icon="unverified" bind:selected={pending} select={updateSearch}>
                <Localized id="browser-filters-unverified-only"/>
            </SelectButton>
        </Rollover>
    </nav>
</div>

<style lang="scss">
    .menu {
        background-color: var(--background-950);
        padding: 0.5rem;
        gap: 0.5rem;
        border-radius: 0.5rem;

        display: flex;
        flex-direction: column;
        align-items: stretch;

        flex-grow: 1;

        & > header {
            display: flex;
            flex-direction: row;
            align-items: center;
            color: var(--text-300);
            font-size: 0.9em;
            gap: var(--gap-small);
        }

        & > nav {
            display: flex;
            flex-direction: column;
            gap: var(--gap-small);
        }
    }
</style>
