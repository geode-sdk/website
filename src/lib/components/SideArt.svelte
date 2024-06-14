<script lang="ts">
    import { onDestroy, onMount } from "svelte";

    // it's so stupid CSS can't do this

    export let side: 'left' | 'right';
    $: bodyHeight = 0;
    let observer: ResizeObserver | undefined;

    onMount(() => {
        observer = new ResizeObserver(ev => {
            bodyHeight = ev[0].contentBoxSize[0].blockSize;
        });
        observer.observe(document.body);
    });
    onDestroy(() => observer?.unobserve(document.body));

</script>

<div class={side} style:--height={`${bodyHeight}px`}/>

<style lang="scss">
    div {
        position: absolute;
        z-index: -10;
        width: 11rem;
        height: calc(var(--height) - var(--page-margin) * 2);

        background-image: url("$lib/assets/sideart.png");
        background-size: contain;
        background-repeat: repeat-y;

        filter: drop-shadow(0px 0px 3rem color-mix(in srgb, var(--primary-700) 15%, transparent));
        opacity: 100%;

        &.left {
            left: 0px;
            transform: scaleX(-1);
        }
        &.right {
            right: 0px;
        }
    }
</style>
