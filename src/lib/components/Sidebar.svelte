<script lang="ts">
    import { onDestroy, onMount } from "svelte";

    // it's so stupid CSS can't do this

    export let side: 'left' | 'right';
    $: bodyHeight = 0;
    let observer: ResizeObserver | undefined;

    onMount(() => {
        observer = new ResizeObserver(ev => {
            bodyHeight = ev[0].contentBoxSize[0].blockSize;
            console.log("new body height: ",bodyHeight);
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
        width: 10rem;
        height: var(--height);

        background-image: url("$lib/assets/sidebar.png");
        background-size: contain;
        background-repeat: repeat-y;

        filter: sepia(75%) drop-shadow(0px 0px 3rem color-mix(in srgb, var(--primary-700) 50%, transparent));

        &.left {
            left: 0px;
        }
        &.right {
            right: 0px;
        }
    }
</style>
