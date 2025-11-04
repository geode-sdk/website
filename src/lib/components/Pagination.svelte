<script lang="ts">
    import type { Snippet } from "svelte";
    import Button from "./Button.svelte";
    import Row from "./Row.svelte";

    interface Props {
        perPage: number;
        total: number;
        page: number;
        pageCount: number;
        label: string;
        labelOne?: string;
        disabled?: boolean;
        select: (page: number) => void;
        children?: Snippet;
    }

    let {
        perPage,
        total,
        page,
        pageCount,
        label,
        labelOne = label,
        disabled = false,
        select,
        children,
    }: Props = $props();

    let max_page = $derived(Math.max(Math.ceil(total / perPage), 1));
    let title = $derived(pageCount == 1 ? labelOne : label);

    const gotoPage = (page: number) => {
        select(page);
    };
</script>

<nav>
    {#if pageCount === total}
        <p>Showing {pageCount} {title}</p>
    {:else}
        <p>Showing {pageCount} of {total} {title}</p>
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
