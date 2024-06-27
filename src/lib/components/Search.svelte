<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import Icon from "./Icon.svelte";

    export let placeholder: string;
    export let query: string;
    export let autofocus = false;

    const dispatch = createEventDispatcher<{ search: { query: string } }>();
</script>

<div class="search">
    <Icon icon="search" />
    <!-- svelte-ignore a11y-autofocus -->
    <input
        {autofocus}
        {placeholder}
        bind:value={query}
        on:input={() => dispatch("search", { query })}
    />
</div>

<style lang="scss">
    div.search {
        display: flex;
        flex-direction: row;
        align-items: center;

        border-radius: 0.5rem;
        background-color: var(--background-950);
        color: var(--text-50);
        font-family: var(--font-body);

        & > :global(*:first-child) {
            margin-left: 1rem;
            opacity: 50%;
        }
        & > input {
            background-color: transparent;
            padding: 1rem;
            flex-grow: 1;
            border: none;
            outline: none;
            color: var(--text-50);

            &::placeholder {
                font-family: var(--font-body);
                color: var(--text-50);
                opacity: 50%;
            }
        }
    }
</style>
