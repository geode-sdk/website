<script lang="ts">
    import type { Snippet } from "svelte";
    import Column from "./Column.svelte";
    import Icon from "./Icon.svelte";

    interface Props {
        title: string;
        open?: boolean;
        children?: Snippet;
    }

    let { title, open = $bindable(), children }: Props = $props();

    if (open == undefined) {
        open = true;
    }
</script>

<details bind:open class:open>
    <summary><Icon icon="down" /> {title}</summary>
    <article><Column align="left" gap="tiny">{@render children?.()}</Column></article>
</details>

<style lang="scss">
    details {
        padding: 0.5rem;
        border-radius: 0.5rem;
        transition: all 300ms;

        & > summary {
            color: var(--text-50);
            text-decoration: none;
            font-size: 0.9em;

            user-select: none;

            transition-property: color, text-decoration;
            transition-duration: 300ms;

            display: inline-flex;
            flex-direction: row;
            align-items: center;
            gap: 0.5rem;
            padding: 0.5rem;
            padding-top: 0.2rem;
            width: 100%;

            cursor: pointer;

            &:hover {
                color: var(--secondary-50);
                text-decoration: underline;
            }
            & > :global(.icon) {
                transition: all 150ms;
            }

            &::marker,
            &::-webkit-details-marker {
                display: none;
            }
        }
        & > article {
            opacity: 0%;
            transform-origin: top;
            transform: scale(0%);
            transition-property: opacity, transform;
            transition-duration: 300ms;
            padding: 0.5rem;
        }
    }
    details.open {
        background-color: color-mix(in srgb, var(--background-300) 10%, transparent);
        & > summary {
            color: var(--secondary-300);
            border-bottom: 0.1rem color-mix(in srgb, var(--secondary-300) 25%, transparent) solid;
            & > :global(.icon) {
                rotate: -180deg;
            }
        }
    }
    details.open > article {
        opacity: 100%;
        transform: scale(100%);
    }
</style>
