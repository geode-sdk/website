<script lang="ts">
    import type { KnownIcon } from "$lib";
    import Icon from "./Icon.svelte";

    export let selected: boolean = false;
    export let icon: KnownIcon;
</script>

<button
    class="select-button" class:selected 
    on:click={() => selected = !selected}
><Icon icon={icon} --icon-size=1.3em/><slot></slot></button>

<style lang="scss">
    button {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: .25rem;

        background-color: transparent;
        color: var(--text-50);
        font-family: var(--font-body);
        
        border: .15rem color-mix(in srgb, var(--secondary-300) 25%, transparent) solid;
        outline: none;
        padding: .25rem;
        border-radius: .25rem;

        transition-property: color, background-color;
        transition-duration: 25ms;

        &:hover {
            background-color: color-mix(in srgb, var(--secondary-300) 25%, transparent);
        }
        &.selected {
            border-color: color-mix(in srgb, var(--primary-300) 50%, transparent);
            background-color: color-mix(in srgb, var(--primary-300) 50%, transparent);
            &:hover {
                background-color: color-mix(in srgb, var(--primary-100) 50%, transparent);
                border-color: color-mix(in srgb, var(--primary-100) 50%, transparent);
            }
        }
    }
</style>
