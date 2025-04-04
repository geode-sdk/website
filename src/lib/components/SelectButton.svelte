<script lang="ts">
    import type { KnownIcon } from "$lib";
    import { createEventDispatcher } from "svelte";
    import Icon from "./Icon.svelte";

    export let selected: boolean = false;
    export let outsideState = false;
    export let icon: KnownIcon;
    export let design: "primary" | "secondary" = "primary";

    const dispatch = createEventDispatcher<{ select: { selected: boolean } }>();
</script>

<button
    class="select-button {design}"
    class:selected
    on:click={() => {
        if (!outsideState) {
            selected = !selected;
        }
        dispatch("select", { selected });
    }}>
    <Icon {icon} --icon-size="1.3em" /><slot></slot>
</button>

<style lang="scss">
    button {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 0.25rem;

        background-color: transparent;
        color: var(--text-50);
        font-family: var(--font-body);

        border: 0.15rem color-mix(in srgb, var(--secondary-300) 25%, transparent) solid;
        outline: none;
        padding: 0.25rem;
        border-radius: 0.25rem;

        transition-property: color, background-color;
        transition-duration: 25ms;

        &:hover {
            background-color: color-mix(in srgb, var(--secondary-300) 25%, transparent);
            cursor: pointer;
        }

        &:focus-visible {
            outline: revert;
        }

        &.selected {
            &.primary {
                border-color: color-mix(in srgb, var(--primary-300) 50%, transparent);
                background-color: color-mix(in srgb, var(--primary-300) 50%, transparent);
            }
            &.secondary {
                border-color: color-mix(in srgb, var(--secondary-300) 50%, transparent);
                background-color: color-mix(in srgb, var(--secondary-300) 50%, transparent);
            }
            &:hover {
                background-color: color-mix(in srgb, var(--primary-100) 50%, transparent);
                border-color: color-mix(in srgb, var(--primary-100) 50%, transparent);
            }
        }
    }
</style>
