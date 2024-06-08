
<script lang="ts">
    import type { KnownIcon } from "$lib";
    import Icon from "./Icon.svelte";

    export let icon: KnownIcon | undefined = undefined;
    export let style: 'primary' | 'secondary' | 'gray' | 'accent' | 'accent-alt' = 'primary';
</script>

<span class={style}>{#if icon}<Icon {icon}/>{/if}<slot/></span>

<style lang="scss">
    span {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: .25rem;
        font-size: .9em;

        --icon-size: 1.2em;

        color: var(--text-950);
        padding: .25rem;
        border-radius: .25rem;

        &.primary {
            background-color: var(--primary-300);
        }
        &.secondary {
            background-color: var(--secondary-300);
        }
        &.accent {
            background-color: var(--accent-300);
        }
        &.accent-alt {
            background-color: var(--accent-alt-300);
        }
        &.gray {
            color: var(--text-50);
            background-color: color-mix(in srgb, var(--background-500) 50%, transparent);
        }
    }
</style>
