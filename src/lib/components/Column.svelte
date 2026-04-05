<script lang="ts">
    import type { Snippet } from "svelte";
    import type { ClassValue, HTMLAttributes } from "svelte/elements";

    interface Props extends HTMLAttributes<HTMLDivElement> {
        align?: Align;
        gap?: Gap;
        justify?: Justify;
        wrap?: boolean;
        reverse?: boolean;
    }

    let {
        align = "center",
        gap = "normal",
        justify = "start",
        wrap = false,
        reverse = false,
        children,
        ...restProps
    }: Props = $props();
</script>

<div style:--wrap={wrap ? 'wrap' : 'nowrap'} style:--gap={`var(--gap-${gap})`} style:--align={align} style:--justify={justify} class:reverse {...restProps}>
    {@render children?.()}
</div>

<style lang="scss">
    div {
        display: flex;
        width: 100%;
        flex-direction: column;
        flex-wrap: var(--wrap);
        gap: var(--gap);
        align-items: var(--align);
        justify-content: var(--justify);
        &.reverse {
            flex-direction: column-reverse;
        }
    }
</style>
