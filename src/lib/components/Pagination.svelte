<script lang="ts">
    import { createEventDispatcher } from "svelte";

    import Button from "./Button.svelte";
    import Row from "./Row.svelte";

    export let perPage: number;
    export let total: number;
    export let page: number;
    export let pageCount: number;
    export let label: string;
    export let disabled = false;

    $: max_page = Math.max(Math.ceil(total / perPage), 1);

    const dispatch = createEventDispatcher<{ select: { page: number } }>();

    const gotoPage = (page: number) => {
        dispatch("select", { page });
    };
</script>

<nav>
    {#if pageCount === total}
        <p>Showing {pageCount} {label}</p>
    {:else}
        <p>Showing {pageCount} of {total} {label}</p>
    {/if}
    <Row>
        <Button
            on:click={async () => gotoPage(Math.max(page - 1, 1))}
            icon="left"
            style="dark-small"
            disabled={disabled || total == 0 || page == 1} />
        <span>Page {page} of {max_page}</span>
        <Button
            on:click={async () => gotoPage(Math.min(page + 1, max_page))}
            icon="right"
            style="dark-small"
            disabled={disabled || total == 0 || page == max_page} />
    </Row>
    <slot />
</nav>

<style lang="scss">
    @use "$lib/styles/media-queries.scss" as *;

    nav {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        align-items: center;
        gap: 1rem;

        @include gt-md {
            display: grid;
            grid-template-columns: 1fr max-content 1fr;
        }

        & :global(*:last-child) {
            justify-self: end;
        }
    }
</style>
