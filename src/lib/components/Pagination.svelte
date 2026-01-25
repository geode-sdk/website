<script lang="ts">
    import type { Snippet } from "svelte";
    import Button from "./Button.svelte";
    import Row from "./Row.svelte";

    interface Props {
        perPage: number;
        total: number;
        page: number;
        pageCount: number;
        formatText: (args: { count: number }) => string;
        formatTextWithTotal: (args: { count: number, total: number }) => string;
        disabled?: boolean;
        select: (page: number) => void;
        children?: Snippet;
    }

    let {
        perPage,
        total,
        page,
        pageCount,
        formatText,
        formatTextWithTotal,
        disabled = false,
        select,
        children,
    }: Props = $props();

    let max_page = $derived(Math.max(Math.ceil(total / perPage), 1));

    const gotoPage = (page: number) => {
        select(page);
    };
</script>

<nav>
    {#if pageCount === total}
        <p>{formatText({ count: pageCount })}</p>
    {:else}
        <p>{formatTextWithTotal({ count: pageCount, total })}</p>
    {/if}
    <Row>
        <Button
            onclick={async () => gotoPage(Math.max(page - 1, 1))}
            icon="left"
            design="dark-small"
            disabled={disabled || total === 0 || page === 1} />
        <span>Page {page} of {max_page}</span>
        <Button
            onclick={async () => gotoPage(Math.min(page + 1, max_page))}
            icon="right"
            design="dark-small"
            disabled={disabled || total === 0 || page === max_page} />
    </Row>

    <div style="justify-self: end;">
        {@render children?.()}
    </div>
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
    }
</style>
