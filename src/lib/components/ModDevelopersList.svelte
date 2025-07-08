<script lang="ts">
    import type { ServerModDeveloper } from "$lib/api/models/mod-developer";
    import Link from "./Link.svelte";
    import ModDeveloperLink from "./ModDeveloperLink.svelte";

    export let developers: ServerModDeveloper[];
    export let full: boolean;
</script>

{#if full}
    {#each developers as developer, index (developer.id)}
        <span class="more">{index > 0 ? ", " : ""}</span><ModDeveloperLink developer={developer} />
    {/each}
{:else}
    {#if developers.length === 0}
        <span>Unknown</span>
    {:else if developers.length === 1}
        <ModDeveloperLink developer={developers[0]} />
    {:else if developers.length === 2}
        <span>
            <ModDeveloperLink developer={developers[0]} />
            <span class="more">&</span>
            <ModDeveloperLink developer={developers[1]} />
        </span>
    {:else}
        {@const owner = developers.find((d) => d.is_owner) ?? developers[0]}
        <span>
            <ModDeveloperLink developer={owner} />
            <span class="more">
                {`+ ${developers.length - 1} More`}
            </span>
        </span>
    {/if}
{/if}

<style lang="scss">
.more {
    font-size: 0.9em;
    color: var(--text-300);
}
</style>
