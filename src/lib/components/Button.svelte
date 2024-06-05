<script lang="ts">
    import type { KnownIcon } from "$lib";
    import Icon from "./Icon.svelte";

    type Style = 
        'primary-filled-dark' |
        'primary-filled' |
        'secondary-filled' |
        'hollow' |
        'dark-small';
    export let style: Style = 'hollow';
    export let href: string | undefined = undefined;
    export let icon: KnownIcon | undefined = undefined;
    export let iconOnRight = false;
    export let disabled = false;
</script>

<a href={href} class={style} class:disabled on:click>
    {#if iconOnRight}
        <slot/>
    {/if}
    {#if icon}
        <Icon {icon} --icon-size=1.5em />
    {/if}
    {#if !iconOnRight}
        <slot/>
    {/if}
</a>

<style lang="scss">
    a {
        font-family: var(--font-body);
        text-decoration: none;

        border-style: solid;
        border-width: .15rem;
        border-radius: .15rem;

        display: flex;
        align-items: center;
        justify-content: center;
        padding: .6rem;
        gap: .6rem;

        transition: color, background-color, border-color, transform;
        transition-duration: var(--transition-duration);

        cursor: pointer;
        user-select: none;

        // &:hover {
        //     transform: scale(105%) translateY(-.2em);
        // }

        &.primary-filled-dark {
            color: var(--primary-300);
            background-color: var(--primary-950);
            border-color: var(--primary-950);
            box-shadow: 0px .1rem .5rem color-mix(in srgb, var(--primary-950) 50%, transparent);
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
            box-shadow: 0px .1rem .5rem color-mix(in srgb, var(--primary-950) 50%, transparent);
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
            box-shadow: 0px .1rem .5rem color-mix(in srgb, var(--secondary-950) 50%, transparent);
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
            box-shadow: 0px .1rem .5rem color-mix(in srgb, var(--secondary-950) 50%, transparent);
            &:hover {
                color: var(--secondary-950);
                background-color: var(--secondary-50);
                border-color: var(--secondary-50);
            }
        }
        &.dark-small {
            padding: .3rem;
            padding-top: .15rem;
            padding-bottom: .15rem;
            gap: .15rem;

            color: var(--background-300);
            background-color: transparent;
            border-color: var(--background-300);
            box-shadow: 0px .1rem .5rem color-mix(in srgb, var(--primary-950) 50%, transparent);
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
