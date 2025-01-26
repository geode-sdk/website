<script lang="ts">
    const alignment = {
        top: "start",
        center: "center",
        bottom: "end",
        stretch: "stretch",
    };
    export let align: keyof typeof alignment = "center";
    export let justify: keyof typeof alignment = "center";
    export let gap: Gap = "normal";
    export let wrap: "wrap" | "nowrap" | "wrap-reverse" = "nowrap";
</script>

<div style="--wrap: {wrap}; --gap: var(--gap-{gap}); --align: {alignment[align]}; --justify: {alignment[justify]}">
    <slot />
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
