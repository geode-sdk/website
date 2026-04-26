<script module lang="ts">
    import type { KnownIcon } from "$lib";
    export type TabsContext = {
        tabs: Writable<{ id: string; name: string; icon: KnownIcon }[]>;
        selectedTab: Writable<string>;
    };
</script>

<script lang="ts">
    import type { Snippet } from "svelte";
    import { onDestroy, setContext } from "svelte";
    import { writable, type Writable } from "svelte/store";
    import cx from "$lib/cx";
    import Icon from "./Icon.svelte";
    import Button from "./Button.svelte";
    interface Props {
        children?: Snippet;
    }

    let { children }: Props = $props();

    const tabs = writable<{ id: string; name: string; icon: KnownIcon }[]>([]);
    const selectedTab = writable("");

    setContext<TabsContext>("tabs", { tabs, selectedTab });

    const unsuscribe = tabs.subscribe((t) => ($selectedTab = t.length ? t[0].id : ""));
    onDestroy(() => unsuscribe());
</script>

<div class="flex flex-col gap-3">
    <div class="flex flex-wrap gap-2">
        {#each $tabs as tab}
            <Button
                onclick={() => ($selectedTab = tab.id)}
                type="button"
                size="small"
                design={$selectedTab === tab.id ? "secondary-filled" : "hollow"}>
                <Icon icon={tab.icon} />{tab.name}
            </Button>
        {/each}
    </div>
    <div class="pages">{@render children?.()}</div>
</div>
