<script lang="ts">
    export let size: Gap;
</script>

<span style="--size: var(--gap-{size})"></span>

<style lang="scss">
    span {
        display: inline-block;
        width: var(--size);
        height: var(--size);
    }
</style>
