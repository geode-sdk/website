<script lang="ts">
    import { icons, type KnownIcon } from "$lib";
    import Icon from '@iconify/svelte';

    export let icon: KnownIcon;
</script>

<span>
    {#if icons[icon].startsWith('@:')}
        {#await import(`$lib/assets/${icons[icon].substring('@:'.length)}.json?raw`) then svg}
            <Icon icon={JSON.parse(svg.default)} />
        {/await}
    {:else}
        <Icon icon={icons[icon]}/>
    {/if}
</span>

<style lang="scss">
    :global(:root) {
        --icon-size: 1em;
    }
    span {
        display: inline-grid;
        place-content: center;
        width: var(--icon-size);
        height: var(--icon-size);

        & > :global(svg) {
            width: var(--icon-size);
            height: var(--icon-size);
        }
    }
</style>
