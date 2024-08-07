<script lang="ts">
    import type { KnownIcon } from "$lib";
    import Icon from "./Icon.svelte";

    type Style = 
        'primary-filled-dark' |
        'primary-filled' |
        'primary-hollow' |
        'secondary-filled-dark' |
        'secondary-filled' |
        'secondary-hollow' |
        'hollow' |
        'dark-small' |
        'money-box';
    export let style: Style = 'hollow';
    export let href: string | undefined = undefined;
    export let target: string | undefined = undefined;
    export let icon: KnownIcon | undefined = undefined;
    export let iconOnRight = false;
    export let disabled = false;
    let enableTheDisabledStyle = false;
    $: enableTheDisabledStyle = $$props['enable-disabled-style']
    let additionalClasses: string | undefined = undefined;
    $: additionalClasses = $$props['additional-classes']

</script>

<a href={href} target={target} class={style + (additionalClasses == undefined ? "" : " " + additionalClasses)} class:disable-style={enableTheDisabledStyle} class:disabled on:click>
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

        &.primary-filled-dark, &.primary-filled-dark.disabled {
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
        &.primary-filled, &.primary-filled.disabled {
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
        &.primary-hollow, &.primary-hollow.disabled {
            color: var(--primary-300);
            background-color: transparent;
            border-color: var(--primary-300);
            box-shadow: 0px .1rem .5rem color-mix(in srgb, var(--primary-950) 50%, transparent);
            &:hover {
                color: var(--secondary-950);
                background-color: var(--primary-50);
                border-color: var(--primary-50);
            }
        }
        &.secondary-filled-dark, &.secondary-filled-dark.disabled {
            color: var(--secondary-300);
            background-color: var(--secondary-950);
            border-color: var(--secondary-950);
            box-shadow: 0px .1rem .5rem color-mix(in srgb, var(--secondary-950) 50%, transparent);
            &:hover {
                color: var(--secondary-950);
                background-color: var(--secondary-50);
                border-color: var(--secondary-50);
            }
        }
        &.secondary-filled, &.secondary-filled.disabled {
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
        &.secondary-hollow, &.secondary-hollow.disabled, &.hollow, &.hollow.disabled{
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
        &.dark-small, &.dark-small.disabled {
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
        &.money-box {
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

            &:hover {
                color: var(--secondary-950);
                background-color: var(--primary-50);
                border-color: var(--primary-50);
            }
        }
        &.disabled {
            pointer-events: none;
            opacity: 55%;
        }
        &.disabled.disable-style {
            color: var(--background-50);
            background-color: var(--background-800);
            border-color: var(--background-800);
            opacity: 35%;
        }
    }

</style>
