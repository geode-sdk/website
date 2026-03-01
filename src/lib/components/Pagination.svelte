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
        <span>Page <input class="small-input" type="text" min="1" max={max_page} value={page} oninput={(e) => gotoPage(parseInt((e.target as HTMLInputElement).value))}> of {max_page}</span>
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

    nav span {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        font-family: var(--font-body);
        color: var(--text-50);
        font-size: 1rem;
        line-height: 1;
    }

    
    nav span input.small-input {
        background-color: transparent;
        padding: 0.25rem 0.5rem;
        width: 2.25rem;
        border: none;
        outline: none;
        color: var(--text-50);
        font-family: inherit;
        font-size: inherit;
        line-height: inherit;
        border-radius: 0.25rem;
        text-align: center;
        vertical-align: middle;
        box-sizing: border-box;
    }

    nav span input.small-input::placeholder {
        color: var(--text-50);
        opacity: 50%;
    }
</style>