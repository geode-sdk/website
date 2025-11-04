<script lang="ts">
    const alignment = {
        top: "start",
        center: "center",
        bottom: "end",
        stretch: "stretch",
    };
    interface Props {
        align?: keyof typeof alignment;
        justify?: keyof typeof alignment;
        gap?: Gap;
        wrap?: "wrap" | "nowrap" | "wrap-reverse";
        children?: import('svelte').Snippet;
    }

    let {
        align = "center",
        justify = "center",
        gap = "normal",
        wrap = "nowrap",
        children
    }: Props = $props();
</script>

<div style="--wrap: {wrap}; --gap: var(--gap-{gap}); --align: {alignment[align]}; --justify: {alignment[justify]}">
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
