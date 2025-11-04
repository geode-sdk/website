<script lang="ts">
    const alignment = {
        left: "start",
        center: "center",
        right: "end",
        stretch: "stretch",
    };
    interface Props {
        align?: keyof typeof alignment;
        gap?: Gap;
        wrap?: boolean;
        reverse?: boolean;
        children?: import('svelte').Snippet;
    }

    let {
        align = "center",
        gap = "normal",
        wrap = false,
        reverse = false,
        children
    }: Props = $props();
</script>

<div style="--wrap: {wrap ? 'wrap' : 'nowrap'}; --gap: var(--gap-{gap}); --align: {alignment[align]}" class:reverse>
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
