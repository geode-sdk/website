<script lang="ts">
    import Column from "./Column.svelte";
    import Icon from "./Icon.svelte";

    export let title: string;
    export let open: boolean = true;
</script>

<details bind:open={open} class:open>
    <summary><Icon icon="down"/> {title}</summary>
    <article><Column align="left" gap="tiny"><slot/></Column></article>
</details>

<style>
    details {
        padding: .5rem;
        border-radius: .5rem;
        transition: all 300ms;
        
        & > summary {
            color: var(--text-50);
            text-decoration: none;
            font-size: .9em;

            user-select: none;
            
            transition-property: color, text-decoration;
            transition-duration: 300ms;
            
            display: inline-flex;
            flex-direction: row;
            align-items: center;
            gap: .5rem;
            padding: .5rem;
            padding-top: .2rem;
            width: calc(100% - 1rem);

            cursor: pointer;

            &:hover {
                color: var(--secondary-50);
                text-decoration: underline;
            }
            & > .icon {
                transition: all 150ms;
            }
        }
        & > article {
            opacity: 0%;
            transform-origin: top;
            transform: scale(0%);
            transition-property: opacity, transform;
            transition-duration: 300ms;
            padding: .5rem;
        }
    }
    details.open {
        background-color: color-mix(in srgb, var(--background-300) 10%, transparent);
        & > summary {
            color: var(--secondary-300);
            border-bottom: .1rem color-mix(in srgb, var(--secondary-300) 25%, transparent) solid;
            & > .icon {
                rotate: -180deg;
            }
        }
    }
    details.open > article {
        opacity: 100%;
        transform: scale(100%);
    }
</style>
