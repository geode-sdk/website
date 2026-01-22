<script lang="ts">
    interface Props {
        size: Gap | "flex";
        blocking?: boolean;
    }

    let { size, blocking = false }: Props = $props();
</script>

<span style="--size: var(--gap-{size})" class={{ flex: size === "flex", blocking }}></span>

<style lang="scss">
    span {
        display: inline-block;
        width: var(--size);
        height: var(--size);
        &.flex {
            flex-grow: 1;
        }
        &.blocking {
            display: block;
        }
    }
</style>
