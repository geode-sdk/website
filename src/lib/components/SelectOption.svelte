<script lang="ts">
    import type { KnownIcon } from "$lib";
    import Icon from "./Icon.svelte";
    import Row from "./Row.svelte";
    import { getContext, onMount } from "svelte";
    import type { SelectContext } from "./Select.svelte";

    const { setValue } = getContext<SelectContext>('select');
    
    export let icon: KnownIcon;
    export let title: string;
    export let value: string;
    export let isDefault: boolean = false;

    onMount(() => {
        if (isDefault) {
            setValue(title, value);
        }
    });
</script>

<button on:click={() => setValue(title, value)}>
    <Row gap="small"><Icon icon={icon} --icon-size=1.3em/>{title}</Row>
</button>

<style lang="scss">
    button {
        display: flex;
        flex-direction: row;

        background-color: transparent;
        color: var(--text-50);
        font-family: var(--font-body);

        border: none;
        outline: none;
        padding: .225rem;
        border-radius: .5rem;

        &:hover {
            background-color: color-mix(in srgb, var(--text-50) 10%, transparent);
            cursor: pointer;
        }
    }
</style>
