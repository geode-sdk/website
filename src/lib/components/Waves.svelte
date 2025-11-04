<script lang="ts">
    type Type = "top-full" | "top" | "bottom";
    interface Props {
        type: Type;
        children?: import('svelte').Snippet;
    }

    let { type, children }: Props = $props();

    let svgFileName = $state();
    switch (type) {
        case "top-full":
            svgFileName = "waves-full";
            break;
        case "top":
            svgFileName = "waves-full";
            break;
        case "bottom":
            svgFileName = "waves-few";
            break;
    }
</script>

<span class={type}>
    {#await import(`../assets/${svgFileName}.svg?raw`) then svg}
        {@html svg.default}
    {/await}
    <div>{@render children?.()}</div>
</span>

<style lang="scss">
    span {
        display: flex;
        width: 100%;
        pointer-events: none;
        justify-content: center;
        align-items: flex-end;

        & > div {
            color: var(--text-950);
            --text-color: var(--text-950);
            --link-hover: var(--primary-500);
            --link-weight: 700;
            pointer-events: auto;
            padding-bottom: 5rem;
        }
        & > :global(svg) {
            position: absolute;
            width: 100%;
            height: 100%;
            z-index: -2;
        }
        &.bottom {
            position: relative;
            width: 100%;
            height: 35rem;
            margin-top: -15rem;
            & > div {
                margin-top: 20rem;
            }
        }
        &.top-full {
            position: absolute;
            height: 65rem;
            top: 0px;
            & > :global(svg) {
                transform: rotate(180deg);
            }
        }
        &.top {
            position: absolute;
            top: -14rem;
            height: 38rem;
            & > :global(svg) {
                transform: rotate(180deg);
            }
        }
    }
</style>
