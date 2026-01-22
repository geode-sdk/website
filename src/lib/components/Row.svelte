<script lang="ts">
    import type { Snippet } from "svelte";

    interface Props {
        align?: Align;
        justify?: Align;
        gap?: Gap;
        wrap?: "wrap" | "nowrap" | "wrap-reverse";
        children?: Snippet;
    }

    let { align = "center", justify = "center", gap = "normal", wrap = "nowrap", children }: Props = $props();
</script>

<div style="--wrap: {wrap}; --gap: var(--gap-{gap}); --align: {align}; --justify: {justify}">
    {@render children?.()}
</div>

<style lang="scss">
    div {
        display: flex;
        flex-direction: row;
        flex-wrap: var(--wrap);
        gap: var(--gap);
        align-items: var(--align);
        justify-content: var(--justify);
    }
</style>
