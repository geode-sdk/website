<script lang="ts">
    import type { KnownIcon } from "$lib";
    import Icon from "./Icon.svelte";

    export let icon: KnownIcon | undefined = undefined;
    export let design:
        | "primary"
        | "secondary"
        | "gray"
        | "accent"
        | "accent-alt"
        | "accent-transparent"
        | "accent-alt-transparent" = "primary";
</script>

<span class={design}>
    {#if icon}<Icon {icon} />{/if}<slot />
</span>

<style lang="scss">
    span {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 0.25rem;
        font-size: 0.9em;

        --icon-size: 1.2em;

        color: var(--text-950);
        padding: 0.25rem;
        border-radius: 0.25rem;

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

        &.accent-alt-transparent {
            background-color: color-mix(
                in srgb,
                var(--accent-alt-200) 15%,
                transparent
            );
            color: var(--accent-alt-100);
        }

        &.accent-transparent {
            background-color: color-mix(
                in srgb,
                var(--accent-200) 15%,
                transparent
            );
            color: var(--accent-100);
        }

        &.gray {
            color: var(--text-50);
            background-color: color-mix(
                in srgb,
                var(--background-500) 50%,
                transparent
            );
        }
    }
</style>
