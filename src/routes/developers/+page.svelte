<script lang="ts">
    import { goto } from "$app/navigation";
    import { page } from "$app/stores";
    import type { PageData } from "./$types.js";

    export let data: PageData;

    $: url_params = $page.url.searchParams;
    $: current_page = data.params.page ?? 1;

    let query = data.params.query ?? "";
    let per_page = data.params.per_page ?? 10;

    $: max_count = data.developers?.count ?? 0;
    $: max_page = Math.floor(max_count / per_page) + 1;

    const onSearch = async () => {
        const params = new URLSearchParams();

        if (query) {
            params.set("query", query);
        }

        if (per_page) {
            params.set("per_page", per_page.toString());
        }

        await goto(`/developers?${params}`, { noScroll: true });
    }

    const gotoPage = async (page: number) => {
        if (current_page < 1) {
            page = 0;
        }
        if (current_page > max_page) {
            page = max_page;
        }

        const params = new URLSearchParams(url_params);
        params.set("page", page.toString());

        await goto(`/developers?${params}`, { noScroll: true });
    }

    const onNext = async () => {
        await gotoPage(current_page + 1);
    }

    const onPrevious = async () => {
        await gotoPage(current_page - 1);
    }
</script>

<h1>Browse Developers</h1>

<div>
    <input type="search" bind:value={query} placeholder="Search display name..." />
    <button on:click={onSearch}>Search</button>
</div>

{#if data.developers}
    {#each data.developers.data as developer}
        <div>
            <a href={`/developers/${developer.id}`}>{developer.display_name}</a>
        </div>
    {/each}
{:else}
    <div>Error loading developers: {data.error}</div>
{/if}

<div>
    {#if current_page > 1}
    <button on:click={onPrevious}>Previous</button>
    {/if}
    <span>Page {current_page} of {max_page}</span>

    {#if current_page < max_page}
    <button on:click={onNext}>Next</button>
    {/if}
</div>
