<script lang="ts">
    import { createEventDispatcher } from "svelte";

    import Icon from "$lib/components/Icon.svelte";
    import Rollover from "$lib/components/Rollover.svelte";
    import SelectButton from "$lib/components/SelectButton.svelte";
    import InfoBox from "$lib/components/InfoBox.svelte";
    import LoadingCircle from "$lib/components/LoadingCircle.svelte";

    import { iconForTag } from "$lib/index.js";
    import type { ServerTag } from "$lib/api/models/base";

    function toggleSet<T>(set: Set<T>, value: T) {
        set.has(value) ? set.delete(value) : set.add(value);
    }

    export let platforms: Set<string>;
    export let tags: Set<string>;
    export let tagsListing: Promise<ServerTag[]> | undefined;
    export let loggedIn: boolean;
    export let featured: boolean;
    export let pending: boolean;
    export let userMods: boolean;

    const dispatch = createEventDispatcher<{ update: {} }>();

    const updateSearch = () => {
        dispatch("update", {});
    };
</script>

<div class="menu">
    <header><Icon icon="filter" --icon-size="1.2em" />Search Filters</header>
    <nav>
        {#if loggedIn}
            <Rollover title="Your mods">
                <SelectButton
                    icon="account"
                    selected={userMods}
                    on:select={() => {
                        userMods = !userMods;
                        updateSearch();
                    }}>
                    Your mods
                </SelectButton>
            </Rollover>
        {/if}
        <Rollover title="Platform">
            <SelectButton
                icon="windows"
                selected={platforms.has("windows")}
                on:select={() => {
                    toggleSet(platforms, "windows");
                    updateSearch();
                }}>
                Windows
            </SelectButton>
            <SelectButton
                icon="mac"
                selected={platforms.has("mac-arm")}
                on:select={() => {
                    toggleSet(platforms, "mac-arm");
                    updateSearch();
                }}>
                macOS (ARM)
            </SelectButton>
            <SelectButton
                icon="mac"
                selected={platforms.has("mac-intel")}
                on:select={() => {
                    toggleSet(platforms, "mac-intel");
                    updateSearch();
                }}>
                macOS (x64)
            </SelectButton>
            <SelectButton
                icon="android"
                selected={platforms.has("android64")}
                on:select={() => {
                    toggleSet(platforms, "android64");
                    updateSearch();
                }}>
                Android (64-bit)
            </SelectButton>
            <SelectButton
                icon="android"
                selected={platforms.has("android32")}
                on:select={() => {
                    toggleSet(platforms, "android32");
                    updateSearch();
                }}>
                Android (32-bit)
            </SelectButton>
            <SelectButton
                icon="ios"
                selected={platforms.has("ios")}
                on:select={() => {
                    toggleSet(platforms, "ios");
                    updateSearch();
                }}>
                iOS
            </SelectButton>
        </Rollover>

        <Rollover title="Tags">
            {#await tagsListing}
                <LoadingCircle size="small" />
            {:then server_tags}
                {#if server_tags}
                    {#each server_tags as tag}
                        <SelectButton
                            icon={iconForTag(tag.name)}
                            selected={tags.has(tag.name)}
                            on:select={() => {
                                toggleSet(tags, tag.name);
                                updateSearch();
                            }}>
                            {tag.display_name}
                        </SelectButton>
                    {/each}
                {:else}
                    <InfoBox type="error">Failed to list tags!</InfoBox>
                {/if}
            {:catch error}
                <InfoBox type="error">Unable to connect to servers!</InfoBox>
            {/await}
        </Rollover>

        <Rollover title="Other">
            <SelectButton icon="featured" bind:selected={featured} on:select={updateSearch}>Featured only</SelectButton>
            <SelectButton icon="unverified" bind:selected={pending} on:select={updateSearch}>
                Unverified only
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
