<script lang="ts">
    import { goto } from "$app/navigation";
    import type { PageData } from "./$types.js";
    import Search from "$lib/components/Search.svelte";
    import { clamp } from "$lib/api/helpers";
    import Pagination from "$lib/components/Pagination.svelte";
    import Column from "$lib/components/Column.svelte";
    import DeveloperCard from "$lib/components/DeveloperCard.svelte";
    import LoadingCircle from "$lib/components/LoadingCircle.svelte";

    export let data: PageData;

    $: current_page = data.params.page ?? 1;

    let searchBar: HTMLInputElement | undefined = undefined;
    let query = data.params.query ?? "";
    let per_page = data.params.per_page ?? 10;
    let timeout: number | undefined = undefined;

    $: max_count = data.developers?.count ?? 0;
    $: max_page = Math.floor(max_count / per_page) + 1;
    $: searching = false;

    const updateParams = async () => {
        const params = new URLSearchParams();

        params.set("query", query);
        params.set("page", current_page.toString());
        params.set("per_page", per_page.toString());

        searching = true;
        await goto(`/developers?${params}`, {
            noScroll: true,
            keepFocus: true,
        });

        if (current_page > max_page) {
            current_page = max_page;
            await updateParams();
        } else {
            searching = false;
        }
    };

    const onSearch = async () => {
        if (timeout) {
            clearTimeout(timeout);
        }

        timeout = setTimeout(() => {
            updateParams();
        }, 300);
    };

    const gotoPage = async (page: number) => {
        current_page = clamp(page, 1, max_page);

        await updateParams();
    };
</script>

<svelte:head>
    <title>Developers | Geode</title>
    <meta name="description" content="Browse the active developers for the Geode mod loader" />
</svelte:head>

<main>
    <Column align="stretch" gap="small">
        <h1>Browse Developers</h1>
        <div>
            <Search placeholder="Search developers..." bind:query on:search={onSearch} bind:ref={searchBar}></Search>
        </div>
        <section class="aside">
            <Pagination
                total={data.developers?.count ?? 0}
                perPage={per_page}
                pageCount={data.developers?.data.length ?? 0}
                page={current_page}
                disabled={!data.developers}
                label="developers"
                labelOne="developer"
                on:select={(e) => gotoPage(e.detail.page)} />
            <ul class="developer-list">
                {#if searching}
                    <div class="loading">
                        <LoadingCircle />
                    </div>
                {:else if data.developers}
                    {#each data.developers.data as developer}
                        <li>
                            <DeveloperCard {developer} />
                        </li>
                    {/each}
                {:else}
                    <div>Error loading developers: {data.error}</div>
                {/if}
            </ul>
        </section>
    </Column>
</main>

<style lang="scss">
    h1 {
        margin-bottom: 1rem;
        text-align: center;
        font-family: var(--font-heading);
        font-weight: 600;
        color: var(--text-50);
        font-size: var(--font-size-long-title);
    }

    .aside {
        display: flex;
        flex-direction: column;
        gap: 1rem;

        background-color: var(--background-950);
        padding: 0.5rem;
        border-radius: 0.5rem;
    }

    .developer-list {
        list-style: none;
        padding: 0;
        margin: 0;
    }

    .developer-list > * + * {
        margin-block-start: 0.5rem;
    }

    .loading {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 700px;
    }
</style>
