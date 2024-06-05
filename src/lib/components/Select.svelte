<script context="module" lang="ts">
    export type SelectContext = {
        setValue: (title: string, value: string) => void,
    };
</script>

<script lang="ts">
    import type { KnownIcon } from "$lib";
    import { createEventDispatcher, setContext } from "svelte";
    import Icon from "./Icon.svelte";
    import Row from "./Row.svelte";
    import { clickoutside } from '@svelte-put/clickoutside';

    export let title: string;
    export let titleIcon: KnownIcon;

    const dispatch = createEventDispatcher<{ 'select': { value: string } }>();
    
    setContext<SelectContext>('select', {
        setValue: (title: string, value: string) => {
            open = false;
            selectedItem.innerHTML = title;
            dispatch('select', { value });
        }
    });
    
    let open: boolean = false;
    let popup: HTMLDivElement;
    let selectedItem: HTMLElement;
</script>

<div
    bind:this={popup}
    class="select-popup" class:open
    use:clickoutside on:clickoutside={() => open = false}
>
    <button on:click={() => {
        open = true;
        popup.style.setProperty('--popup-width', `${popup.getBoundingClientRect().width}px`);
    }}>
        <Row gap="small"><Icon icon={titleIcon}/>
            {title}: <span bind:this={selectedItem}/>
        </Row>
    </button>
    <div class="content">
        <div><slot/></div>
    </div>
</div>

<style lang="scss">
    .select-popup {
        border-radius: .5rem;
        padding: .5rem;
        background-color: var(--background-950);
        color: var(--text-50);
        font-family: var(--font-body);

        box-sizing: border-box;
        border: .1rem solid transparent;

        transition: border-color;
        transition-duration: var(--transition-duration);

        & > button {
            display: flex;
            flex-direction: row;
            background-color: transparent;
            border: none;
            outline: none;
            padding: .225rem;
            padding-right: 1rem;
            color: var(--text-50);
            font-family: var(--font-body);
            border-radius: .5rem;
            cursor: pointer;
        }
        &:not(.open) > button:hover {
            background-color: color-mix(in srgb, var(--text-50) 10%, transparent);
        }
        &:not(.open) > .content {
            opacity: 0%;
            pointer-events: none;

            & > div {
                opacity: 0%;
                transform: scale(0%);
            }
        }
        &.open {
            background-color: color-mix(in srgb, var(--background-300) 10%, var(--background-950));

            border-color: color-mix(in srgb, var(--secondary-300) 25%, transparent);
            border-radius: .5rem .5rem 0rem 0rem;
            border-bottom-color: transparent;

            box-shadow: 0px 0px .35rem rgba(0, 0, 0, 0.5);

            & > button {
                color: var(--secondary-300);
            }
            & > .content {
                border: .1rem solid color-mix(in srgb, var(--secondary-300) 25%, transparent);
                border-top-color: transparent;
                box-shadow: 0px .35rem .35rem rgba(0, 0, 0, 0.5);
                background-color: color-mix(in srgb, var(--background-300) 10%, var(--background-950));
            }
        }
        &.open > .content > div {
            opacity: 100%;
            transform: scale(100%);
        }
        & > .content {
            box-sizing: border-box;
            position: absolute;
            margin-left: -.6rem;
            margin-top: .55rem;
            border-radius: 0rem 0rem .5rem .5rem;
            padding: .5rem;
            padding-top: 0rem;
            width: calc(var(--popup-width) + .05rem);
            z-index: 1;

            background-color: var(--background-950);

            & > div {
                border-top: .1rem color-mix(in srgb, var(--secondary-300) 25%, transparent) solid;
                padding-top: .5rem;

                transition: transform, opacity;
                transition-duration: var(--transition-duration);
                transform-origin: top;

                display: flex;
                flex-direction: column;
                gap: .5rem;
                
                color: var(--text-50);
            }
        }
    }
</style>
