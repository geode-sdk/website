<script lang="ts">
    import type { KnownIcon } from "$lib";
    import type { Snippet } from "svelte";

    import Icon from "./Icon.svelte";

    type Style = "primary-filled-dark" | "primary-filled" | "secondary-filled" | "hollow" | "dark-small";
    interface Props {
        design?: Style;
        href?: string | undefined;
        icon?: KnownIcon | undefined;
        iconOnRight?: boolean;
        disabled?: boolean;
        onclick?: () => void;
        children?: Snippet;
    }

    let {
        design = "hollow",
        href = undefined,
        icon = undefined,
        iconOnRight = false,
        disabled = false,
        onclick,
        children,
    }: Props = $props();
</script>

<a {href} class={design} class:disabled {onclick}>
    {#if iconOnRight}
        {@render children?.()}
    {/if}
    {#if icon}
        <Icon {icon} --icon-size="1.5em" />
    {/if}
    {#if !iconOnRight}
        {@render children?.()}
    {/if}
</a>

<style lang="scss">
    a {
        font-family: var(--font-body);
        text-decoration: none;

        border-style: solid;
        border-width: 0.15rem;
        border-radius: 0.15rem;

        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0.6rem;
        gap: 0.6rem;

        transition: color, background-color, border-color, transform;
        transition-duration: var(--transition-duration);

        cursor: pointer;
        user-select: none;

        // &:hover {
        //     transform: scale(105%) translateY(-.2em);
        // }

        &:focus-visible {
            outline: revert;
        }

        &.primary-filled-dark {
            color: var(--primary-300);
            background-color: var(--primary-950);
            border-color: var(--primary-950);
            box-shadow: 0px 0.1rem 0.5rem color-mix(in srgb, var(--primary-950) 50%, transparent);
            &:hover {
                color: var(--secondary-950);
                background-color: var(--primary-50);
                border-color: var(--primary-50);
            }
        }
        &.primary-filled {
            color: var(--primary-950);
            background-color: var(--primary-300);
            border-color: var(--primary-300);
            box-shadow: 0px 0.1rem 0.5rem color-mix(in srgb, var(--primary-950) 50%, transparent);
            &:hover {
                color: var(--secondary-950);
                background-color: var(--primary-50);
                border-color: var(--primary-50);
            }
        }
        &.secondary-filled {
            color: var(--secondary-950);
            background-color: var(--secondary-300);
            border-color: var(--secondary-300);
            box-shadow: 0px 0.1rem 0.5rem color-mix(in srgb, var(--secondary-950) 50%, transparent);
            &:hover {
                color: var(--secondary-950);
                background-color: var(--secondary-50);
                border-color: var(--secondary-50);
            }
        }
        &.hollow {
            color: var(--secondary-300);
            background-color: transparent;
            border-color: var(--secondary-300);
            box-shadow: 0px 0.1rem 0.5rem color-mix(in srgb, var(--secondary-950) 50%, transparent);
            &:hover {
                color: var(--secondary-950);
                background-color: var(--secondary-50);
                border-color: var(--secondary-50);
            }
        }
        &.dark-small {
            padding: 0.3rem;
            padding-top: 0.15rem;
            padding-bottom: 0.15rem;
            gap: 0.15rem;

            color: var(--background-300);
            background-color: transparent;
            border-color: var(--background-300);
            box-shadow: 0px 0.1rem 0.5rem color-mix(in srgb, var(--primary-950) 50%, transparent);
            &:hover {
                color: var(--secondary-950);
                background-color: var(--primary-50);
                border-color: var(--primary-50);
            }
        }
        &.disabled {
            pointer-events: none;
            color: var(--background-50);
            background-color: var(--background-800);
            border-color: var(--background-800);
            opacity: 35%;
        }
    }
</style>
