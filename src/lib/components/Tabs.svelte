<script context="module" lang="ts">
    import type { KnownIcon } from "$lib";
    export type TabsContext = {
        tabs: Writable<{ id: string, name: string, icon: KnownIcon }[]>,
        selectedTab: Writable<string>,
    };
</script>

<script lang="ts">
    import { onDestroy, setContext } from "svelte";
    import { writable, type Writable } from "svelte/store";
    import Icon from "./Icon.svelte";

    const tabs = writable<{ id: string, name: string, icon: KnownIcon }[]>([]);
    const selectedTab = writable('');

    setContext<TabsContext>('tabs', { tabs, selectedTab });

    const unsuscribe = tabs.subscribe(t => $selectedTab = t.length ? t[0].id : '');
    onDestroy(() => unsuscribe());
</script>

<div class="tabs-container">
    <div class="tabs">
        {#each $tabs as tab}
            <button
                on:click={() => $selectedTab = tab.id}
                class:selected={$selectedTab === tab.id}
            ><Icon icon={tab.icon}/>{tab.name}</button>
        {/each}
    </div>
    <div class="pages"><slot/></div>
</div>

<style lang="scss">
    .tabs-container {
        display: flex;
        flex-direction: column;
        align-items: start;
        gap: .75rem;
        max-width: 50vw;
    }
    .tabs {
        display: flex;
        flex-direction: row;
        gap: .25rem;
        // padding: .35rem;
        // border-radius: .85rem;
        // background-color: color-mix(in srgb, var(--background-500) 25%, transparent);

        button {
            display: flex;
            flex-direction: row;
            align-items: center;
            gap: .25rem;

            --icon-size: 1.2em;

            padding: .5rem;
            padding-bottom: .35rem;
            padding-top: .35rem;

            background-color: transparent;
            color: var(--text-300);
            font-family: var(--font-body);
            font-size: .9em;

            // background-color: color-mix(in srgb, var(--background-500) 25%, transparent);
            border: .15rem solid color-mix(in srgb, var(--background-300) 50%, transparent);
            // border: none;
            border-radius: .5rem;

            transition-duration: var(--transition-duration);

            &.selected {
                background-color: color-mix(in srgb, var(--background-400) 50%, transparent);
                color: var(--text-50);
                border-color: var(--background-400);
                pointer-events: none;
            }
            &:hover {
                background-color: color-mix(in srgb, var(--background-500) 75%, transparent);
                color: var(--text-50);
                border-color: var(--background-500);
                cursor: pointer;
            }
        }
    }
</style>
