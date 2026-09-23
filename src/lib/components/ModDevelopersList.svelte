<script lang="ts">
    import type { ServerModDeveloper } from "$lib/api/models/mod-developer";
    import ModDeveloperLink from "./ModDeveloperLink.svelte";

    interface Props {
        developers: ServerModDeveloper[];
        full: boolean;
    }

    let { developers, full }: Props = $props();
</script>

<span class="developers-list">
    {#if full}
        {#each developers as developer, index (developer.id)}
            <span class="more">{index > 0 ? ", " : ""}</span>
            <ModDeveloperLink {developer} />
        {/each}
    {:else if developers.length === 0}
        <span>Unknown</span>
    {:else if developers.length === 1}
        <ModDeveloperLink developer={developers[0]} />
    {:else if developers.length === 2}
        <ModDeveloperLink developer={developers[0]} />
        <span class="more">&</span>
        <ModDeveloperLink developer={developers[1]} />
    {:else}
        {@const owner = developers.find((d) => d.is_owner) ?? developers[0]}
        <ModDeveloperLink developer={owner} />
        <span class="more">
            {`+ ${developers.length - 1} More`}
        </span>
    {/if}
</span>

<style>
    .developers-list {
        display: flex;
        align-items: center;
        gap: var(--gap-tiny);
    }

    .more {
        font-size: 0.9em;
        color: var(--text-300);
    }
</style>
