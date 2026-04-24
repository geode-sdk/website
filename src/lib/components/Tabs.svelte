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

<div class="flex flex-col items-start gap-3">
    <div class="flex flex-wrap gap-2">
        {#each $tabs as tab}
            <button
                class={cx(
                    "flex items-center gap-1 rounded-md border-2 border-solid bg-transparent p-2 py-1 text-sm text-zinc-300 transition",
                    "hover:cursor-pointer hover:bg-(--background-600)",
                    $selectedTab === tab.id && "bg-(--background-500) text-zinc-50",
                )}
                onclick={() => ($selectedTab = tab.id)}
                class:selected={$selectedTab === tab.id}>
                <Icon icon={tab.icon} />{tab.name}
            </button>
        {/each}
    </div>
    <div class="pages">{@render children?.()}</div>
</div>
