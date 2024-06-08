
<script lang="ts">
    import { getContext, onDestroy } from "svelte";
    import type { TabsContext } from "./Tabs.svelte";
    import type { KnownIcon } from "$lib";

    export let name: string;
    export let id: string;
    export let icon: KnownIcon;

    const { selectedTab, tabs } = getContext<TabsContext>('tabs');
    $tabs = [...$tabs, { id, name, icon }];

    onDestroy(() => {
        tabs.update(tabs => tabs.filter(t => t.id !== id));
    });
</script>

<article id={id} class:selected={$selectedTab === id}><slot/></article>

<style lang="scss">
    article {
        transition-duration: var(--transition-duration);
    }
    article:not(.selected) {
        visibility: hidden;
        height: 0px;
        opacity: 0%;
    }
</style>
