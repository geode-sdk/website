<script lang="ts">
    interface Props {
        size: Gap | "flex";
    }

    let { size }: Props = $props();
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
