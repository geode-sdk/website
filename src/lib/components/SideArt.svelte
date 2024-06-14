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
</style>
