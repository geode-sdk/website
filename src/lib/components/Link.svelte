<script lang="ts">
    import type { KnownIcon } from "$lib";
    import Icon from "./Icon.svelte";

    export let icon: KnownIcon | undefined = undefined;
    export let href: string;
    export let bold = false;
</script>

<a href={href} style="{bold ? '--link-weight: 600' : undefined}">
    {#if icon}
        <Icon {icon} --icon-size=1.15em/>
    {/if}
    <span><slot/></span>
</a>

<style lang="scss">
    :global(:root) {
        --link-hover: var(--text-50);
        --link-color: var(--text-color);
    }

    a {
        text-decoration: none;

        display: inline-flex;
        flex-direction: row;
        align-items: center;
        gap: var(--gap-small);
        font-weight: var(--link-weight);
        font-size: var(--font-size);

        transition: color, text-decoration;
        transition-duration: var(--transition-duration);

        color: var(--link-color);

        &:hover {
            text-decoration: underline;
            color: var(--link-hover);
        }
    }
</style>
