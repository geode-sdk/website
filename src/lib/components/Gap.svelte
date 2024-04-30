<script lang="ts">
    export let size: Gap;
</script>

<div style="--size: var(--gap-{size})"></div>

<style lang="scss">
    div {
        width: var(--size);
        height: var(--size);
    }
</style>
