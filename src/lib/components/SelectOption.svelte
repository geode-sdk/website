<script lang="ts">
    import type { KnownIcon } from "$lib";
    import Icon from "./Icon.svelte";
    import Row from "./Row.svelte";
    import { getContext, onMount } from "svelte";
    import type { SelectContext } from "./Select.svelte";

    const { setValue } = getContext<SelectContext>("select");

    interface Props {
        icon: KnownIcon;
        title: string;
        value: string;
        isDefault?: boolean;
    }

    let { icon, title, value, isDefault = false }: Props = $props();

    onMount(() => {
        if (isDefault) {
            setValue(title, value);
        }
    });
</script>

<button onclick={() => setValue(title, value)}>
    <Row gap="small">
        <Icon {icon} --icon-size="1.3em" />
        <span class="option-text">{title}</span>
    </Row>
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
        padding: 0.225rem;
        border-radius: 0.5rem;

        &:hover {
            background-color: color-mix(in srgb, var(--text-50) 10%, transparent);
            cursor: pointer;
        }
    }

    .option-text {
        text-align: left;
    }
</style>
