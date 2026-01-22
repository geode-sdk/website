<script lang="ts">
    import type { Snippet } from "svelte";

    interface Props {
        align?: Align;
        gap?: Gap;
        wrap?: boolean;
        reverse?: boolean;
        children?: Snippet;
    }

    let { align = "center", gap = "normal", wrap = false, reverse = false, children }: Props = $props();
</script>

<div style="--wrap: {wrap ? 'wrap' : 'nowrap'}; --gap: var(--gap-{gap}); --align: {align}" class:reverse>
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
        &.reverse {
            flex-direction: column-reverse;
        }
    }
</style>
