<script lang="ts">
    import type { Snippet } from "svelte";

    import type { KnownIcon } from "$lib";
    import Icon from "./Icon.svelte";

    interface Props {
        selected?: boolean;
        outsideState?: boolean;
        icon: KnownIcon;
        design?: "primary" | "secondary";
        select?: (selected: boolean) => void;
        search?: (query: string) => void;
        query?: string;
        placeholder?: string;
        children?: Snippet;
    }

    let { selected = $bindable(), outsideState = false, icon, design = "primary", select, children, query = $bindable(""), placeholder, search }: Props = $props();
    let searchTimeout: ReturnType<typeof setTimeout> | undefined;

    if (selected == undefined) {
        selected = false;
    }

    const updateQuery = async () => {
        // good 4 the servers i <3 the servers
        if (searchTimeout) {
            clearTimeout(searchTimeout);
        }

        searchTimeout = setTimeout(() => {
            search?.(query);
        }, 300);
    };

    const doSearch = () => {
        if (searchTimeout) {
            clearTimeout(searchTimeout);
            searchTimeout = undefined;
        }
        search?.(query);
    };
</script>

{#if search}
    <div class="select-button dev-search {design}">
        <Icon {icon} --icon-size="1.3em" />
        <input {placeholder} bind:value={query} oninput={updateQuery} onblur={doSearch} />
    </div>
{:else}
    <button
        class="select-button {design}"
        class:selected
        onclick={() => {
            if (!outsideState) {
                selected = !selected;
            }
            select?.(selected ?? false);
        }}>
        <Icon {icon} --icon-size="1.3em" />{@render children?.()}
    </button>
{/if}

<style lang="css">
    button,
    .dev-search {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 0.25rem;
        font-size: 0.8rem;

        background-color: transparent;
        color: var(--text-50);
        font-family: var(--font-body);

        border: 0.15rem color-mix(in srgb, var(--secondary-300) 25%, transparent) solid;
        outline: none;
        padding: 0.25rem;
        border-radius: 0.25rem;

        transition-property: color, background-color;
        transition-duration: 25ms;
    }

    button {
        &:hover {
            background-color: color-mix(in srgb, var(--secondary-300) 25%, transparent);
            cursor: pointer;
        }

        &:focus-visible {
            outline: revert;
        }

        &.selected {
            &.primary {
                border-color: color-mix(in srgb, var(--primary-300) 50%, transparent);
                background-color: color-mix(in srgb, var(--primary-300) 50%, transparent);
            }
            &.secondary {
                border-color: color-mix(in srgb, var(--secondary-300) 50%, transparent);
                background-color: color-mix(in srgb, var(--secondary-300) 50%, transparent);
            }
            &:hover {
                background-color: color-mix(in srgb, var(--primary-100) 50%, transparent);
                border-color: color-mix(in srgb, var(--primary-100) 50%, transparent);
            }
        }
    }

    .dev-search {
        &:focus-within,
        &:hover {
            background-color: color-mix(in srgb, var(--secondary-300) 25%, transparent);
        }

        & > input {
            min-width: 0;
            width: 100%;
            outline: none;
        }
    }
</style>
