<script lang="ts">
    export let size: Gap | "flex";
</script>

<span style="--size: var(--gap-{size})" class:flex={size === "flex"}></span>

<style lang="scss">
    span {
        display: inline-block;
        width: var(--size);
        height: var(--size);
        &.flex {
            flex-grow: 1;
        }
    }
</style>
