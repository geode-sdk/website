<script lang="ts">
    import { icons, type KnownIcon } from "$lib";
    import Icon from '@iconify/svelte';

    export let icon: KnownIcon;
    export let inline = false;
</script>

<span class="icon">
    {#if icons[icon].startsWith('@:')}
        {#await import(`$lib/assets/${icons[icon].substring('@:'.length)}.json?raw`) then svg}
            <Icon icon={JSON.parse(svg.default)} {inline} />
        {/await}
    {:else}
        <Icon icon={icons[icon]} {inline}/>
    {/if}
</span>

<style lang="scss">
    :global(:root) {
        --icon-size: 1.563em;
    }
    span {
        display: inline-grid;
        place-content: center;
        width: var(--icon-size);
        height: var(--icon-size);
        color: var(--icon-color);

        & > :global(svg) {
            width: var(--icon-size);
            height: var(--icon-size);
        }
    }
</style>
