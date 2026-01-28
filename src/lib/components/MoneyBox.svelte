<script lang="ts">
    import type { KnownIcon } from "$lib";
    import Icon from "./Icon.svelte";

    import { Tween } from "svelte/motion";
    import { quintOut } from "svelte/easing";
    import { error } from "@sveltejs/kit";

    let { icon, text, number, locale }: {
        icon: KnownIcon;
        text: string;
        number: number;
        locale: string;
    } = $props();

    const INSERT_NUM_HERE = "<num>";
    const [textPreNum, textPostNum] = $derived.by(() => {
        const start = text.indexOf(INSERT_NUM_HERE);
        if (start === -1) {
            error(500, `Missing <num> in MoneyBox with text ${text}`);
        }
        return [
            text.substring(0, start),
            text.substring(start + INSERT_NUM_HERE.length)
        ];
    });
    const tween = new Tween(0, { duration: 1500, easing: quintOut });

    const beginCount = (node: HTMLElement) => {
        $effect(() => {
            const observer = new IntersectionObserver(
                (entries) => {
                    entries.reverse().forEach((entry) => {
                        if (entry.isIntersecting) {
                            tween.target = number;
                        }
                    });
                },
                {
                    threshold: 0.65,
                },
            );
            observer.observe(node);
            return () => observer.unobserve(node);
        });
    };
</script>

<div>
    <Icon {icon} />
    {textPreNum}
    <span class="countup" use:beginCount>{new Intl.NumberFormat(locale).format(Math.round(tween.current))}</span>
    {textPostNum}
</div>

<style lang="scss">
    div {
        border: 0.15rem color-mix(in srgb, var(--background-300) 50%, transparent) solid;
        border-radius: 0.5rem;

        background-color: color-mix(in srgb, var(--background-500) 20%, transparent);
        color: var(--text-100);
        font-size: 1.1em;

        padding: 0.65rem;

        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 0.25em;

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
