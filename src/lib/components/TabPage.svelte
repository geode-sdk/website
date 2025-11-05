<script lang="ts">
    import type { Snippet } from "svelte";

    import { getContext, onDestroy } from "svelte";
    import type { TabsContext } from "./Tabs.svelte";
    import type { KnownIcon } from "$lib";

    interface Props {
        name: string;
        id: string;
        icon: KnownIcon;
        children?: Snippet;
    }

    let { name, id, icon, children }: Props = $props();

    const { selectedTab, tabs } = getContext<TabsContext>("tabs");
    $tabs = [...$tabs, { id, name, icon }];

    onDestroy(() => {
        tabs.update((tabs) => tabs.filter((t) => t.id !== id));
    });
</script>

<article {id} class:selected={$selectedTab === id}>{@render children?.()}</article>

<style lang="scss">
    article {
        transition-duration: var(--transition-duration);
    }
    article:not(.selected) {
        display: none;
        // visibility: hidden;
        // height: 0;
        // overflow: hidden;
        // opacity: 0%;
    }
</style>
