<script lang="ts">
    import type { KnownIcon } from "$lib";
    import Icon from "./Icon.svelte";
    import { onMount } from "svelte";

    import { tweened } from 'svelte/motion';
    import { quintOut } from 'svelte/easing';
    import { derived } from 'svelte/store';
    
    export let icon: KnownIcon;
    export let text: string;
    export let num: number;

    let countup = tweened(0, { duration: 1500, easing: quintOut });
    let formatted = derived(countup, ($countup) => $countup.toLocaleString(undefined, { maximumFractionDigits: 0 }));

    let number: HTMLSpanElement;

    onMount(() => {
        const observer = new IntersectionObserver(entries => {
            entries.reverse().forEach(entry => {
                if (entry.isIntersecting) {
                    countup.set(num);
                }
            });
        }, {
            threshold: 0.65
        });
        observer.observe(number);
        return () => observer.unobserve(number);
    });
</script>

<div><Icon icon={icon}/><span class="countup" bind:this={number}>{$formatted}</span>{text}</div>

<style lang="scss">
    div {
        border: .15rem color-mix(in srgb, var(--background-300) 50%, transparent) solid;
        border-radius: .5rem;

        background-color: color-mix(in srgb, var(--background-500) 20%, transparent);
        color: var(--text-100);
        font-size: 1.1em;

        padding: .65rem;

        display: flex;
        flex-direction: row;
        align-items: center;
        gap: .25em;

        & :global(svg) {
            opacity: 50%;
            color: var(--secondary-300);
        }
        & :global(span) {
            color: var(--primary-300);
            font-weight: 500;
            font-style: normal;
            width: var(--num-width);
            text-align: center;
        }
    }
</style>
