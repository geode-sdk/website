<script lang="ts">
    import LoadingCircle from "./LoadingCircle.svelte";
    export let loading: boolean;
</script>

<span class="overlay-container">
    <div class="overlay" class:hidden={!loading}>
        <span><LoadingCircle /></span>
    </div>
    <slot />
</span>

<style lang="scss">
    .overlay-container {
        position: relative;
    }

    .overlay {
        position: absolute;
        width: 100%;
        height: 100%;

        display: flex;
        align-items: center;
        justify-content: center;

        background-color: color-mix(in srgb, var(--background-950) 80%, transparent);

        &.hidden {
            display: none;
            pointer-events: none;
        }
    }
</style>
