<script lang="ts">
    import LoadingCircle from "./LoadingCircle.svelte";
    interface Props {
        loading: boolean;
        size?: "small" | "normal";
        children?: import('svelte').Snippet;
    }

    let { loading, size = "normal", children }: Props = $props();
</script>

<span class="overlay-container">
    <div class="overlay" class:hidden={!loading}>
        <span class="circle-span"><LoadingCircle {size} /></span>
    </div>
    {@render children?.()}
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

    .circle-span {
        display: flex;
    }
</style>
