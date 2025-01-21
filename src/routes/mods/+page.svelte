<script lang="ts">
    import { goto } from "$app/navigation";
    import { page } from "$app/stores";
    import type { PageData } from "./$types.js";

    import ModCard from "$lib/components/ModCard.svelte";
    import Gap from "$lib/components/Gap.svelte";
    import Column from "$lib/components/Column.svelte";
    import SelectButton from "$lib/components/SelectButton.svelte";
    import Row from "$lib/components/Row.svelte";
    import Select from "$lib/components/Select.svelte";
    import Search from "$lib/components/Search.svelte";
    import SelectOption from "$lib/components/SelectOption.svelte";
    import Waves from "$lib/components/Waves.svelte";
    import Image from "$lib/components/Image.svelte";
    import InfoBox from "$lib/components/InfoBox.svelte";
    import FilterMenu from "$lib/components/FilterMenu.svelte";
    import Pagination from "$lib/components/Pagination.svelte";
    import LoadingOverlay from "$lib/components/LoadingOverlay.svelte";
    import type { ModSearchParams } from "$lib/api/index-repository";
    import type { ServerDeveloper } from "$lib/api/models/base";

    export let data: PageData;
    const params = data.params! as ModSearchParams;
    const profile: ServerDeveloper | null = data.loggedInUser ?? null;

    $: url_params = $page.url.searchParams;
    $: current_page = params.page ?? 1;

    let query = params.query ?? "";
    $: platforms = new Set(params.platforms ?? []);
    let sort = params.sort ?? "downloads";
    let tags = new Set(params.tags ?? []);
    let featured = params.featured ?? false;
    let developer = params.developer ?? "";
    let pending = params.status != "accepted";
    let userMods = false;
    let geode = params.geode ?? "";
    let gd = params.gd ?? "";
    let per_page = params.per_page ?? 10;
    let searching = false;
    let view: 'list' | 'dual-list' | 'grid' = 'dual-list';
    let searchBar: HTMLInputElement;
    let searchTimeout: number | null = null;
    let filters_enabled = false;

    const valid_sort = sort == "downloads"
        || sort == "recently_updated"
        || sort == "recently_uploaded"
        || sort == "name"
        || sort == "name_reverse";

    $: max_count = data.mods?.count ?? 0;
    $: max_page = Math.floor((max_count - 1) / per_page) + 1;

    const perPageOptions = [10, 15, 20];

    const updateQuery = () => {
        // debouce search bar so we're not making a ton of useless requests

        if (searchTimeout) {
            clearTimeout(searchTimeout);
        }

        searchTimeout = setTimeout(() => {
            updateSearch();
        }, 300);
    }

    const scrollToTop = () => {
        document.body.scrollIntoView({
            behavior: "smooth",
            block: "start",
        });
    }

    const updateSearch = async (scroll = false) => {
        searching = true;
        const params = new URLSearchParams();
        if (query) {
            params.set("query", query);
        }
        if (platforms.size > 0) {
            for (const platform of platforms) {
                params.append("platform", platform);
            }
        }
        if (tags.size > 0) {
            for (const tag of tags) {
                params.append("tag", tag);
            }
        }
        if (featured) {
            params.set("featured", "true");
        }
        if (pending) {
            params.set("status", "pending");
        }
        if (per_page) {
            params.set("per_page", per_page.toString());
        }
        if (userMods && profile !== null) {
            params.set("developer", profile.username);
        } else if (developer) {
            params.set("developer", developer);
        }
        if (gd) {
            params.set("gd", gd);
        }
        if (geode) {
            params.set("geode", geode);
        }
        params.set("sort", sort);

        await goto(`/mods?${params}`, { noScroll: true, keepFocus: true });
        searching = false;
        if (scroll)
            scrollToTop();
    }

    const gotoPage = async (page: number) => {
        searching = true;
        if (current_page < 1) {
            page = 0;
        }
        if (current_page > max_page) {
            page = max_page;
        }

        const params = new URLSearchParams(url_params);
        params.set("page", page.toString());

        await goto(`/mods?${params}`, { noScroll: true });
        searching = false;
        scrollToTop();
    }

    const onKeydown = (e: KeyboardEvent) => {
        // avoid stealing focus from another element or modifier keys
        if (!(e.target instanceof HTMLBodyElement) || e.key.length > 1) {
            return;
        }

        searchBar.focus();
    }
</script>

<svelte:head>
    <title>Mods | Geode</title>
    <meta name="description" content="Browse mods for the Geode mod loader">
</svelte:head>

<Waves type="top" />
<Gap size="large" />

<h1>Browse Mods</h1>

<div class="content-separator">
    <aside class="filter-column">
        <FilterMenu
            bind:platforms={platforms}
            bind:tags={tags}
            tagsListing={data.tags}
            loggedIn="{profile !== null}"
            bind:featured={featured}
            bind:pending={pending}
            bind:userMods={userMods}
            on:update={updateSearch} />
    </aside>

    <Column align="stretch" gap="small">
        <nav class="search">
            <Search placeholder="Search mods..." bind:query on:search={updateQuery} bind:ref={searchBar}></Search>
            <div class="search-filters">
                <Select title="Sort by" titleIcon="sort" on:select={ev => {
                    if (sort != ev.detail.value) {
                        sort = ev.detail.value;
                        updateSearch();
                    }
                }}>
                    <SelectOption icon="download" title="Most Downloaded" value="downloads" isDefault={sort == "downloads" || !valid_sort}/>
                    <SelectOption icon="time" title="Most Recent" value="recently_published" isDefault={sort == "recently_published"} />
                    <SelectOption icon="time" title="Recently Updated" value="recently_updated" isDefault={sort == "recently_updated"} />
                    <SelectOption icon="sort-abc" title="Name (A-Z)" value="name" isDefault={sort == "name"} />
                    <SelectOption icon="sort-cba" title="Name (Z-A)" value="name_reverse" isDefault={sort == "name_reverse"} />
                </Select>
                <span class="toggle-filter-button">
                    <SelectButton
                        icon="filter"
                        selected={filters_enabled}
                        on:select={() => filters_enabled = !filters_enabled} />
                </span>
            </div>
        </nav>

        <div class="filter-inline" class:collapsed={!filters_enabled}>
            <FilterMenu
                bind:platforms={platforms}
                bind:tags={tags}
                tagsListing={data.tags}
                bind:featured={featured}
                bind:pending={pending}
                bind:userMods={userMods}
                on:update={updateSearch} />
        </div>

        <main>
            <Pagination
                total={data.mods?.count ?? 0}
                perPage={per_page}
                pageCount={data.mods?.data.length ?? 0}
                page={current_page}
                disabled={!data.mods}
                label="mods"
                labelOne="mod"
                on:select={(e) => gotoPage(e.detail.page)}
            >
                <Row gap="small" justify="bottom">
                    <SelectButton
                        on:select={() => view = 'list'} selected={view === 'list'} outsideState={true}
                        style="secondary"
                        icon="view-list"
                    />
                    <SelectButton
                        on:select={() => view = 'dual-list'} selected={view === 'dual-list'} outsideState={true}
                        style="secondary"
                        icon="view-dual-list"
                    />
                    <SelectButton
                        on:select={() => view = 'grid'} selected={view === 'grid'} outsideState={true}
                        style="secondary"
                        icon="view-grid"
                    />
                </Row>
            </Pagination>

            <LoadingOverlay loading={searching}>
                <!-- this goofy thing just makes sure the size of the mods list stays 
                    the same even if there are fewer items than needed to fill it -->
                <div class="mod-listing-size-enforcer">
                    <span/>
                    <span/>
                    <span/>
                    <span/>
                    <span/>
                    <span/>
                    <span/>
                    <span/>
                </div>
                {#if data.error}
                    <Gap size="normal"/>
                    <InfoBox type="error">{data.error}</InfoBox>
                    <Gap size="normal"/>
                {:else}
                    {#if data.mods && max_count > 0}
                        <div class="mod-listing {view}">
                            {#each data.mods.data as mod (mod.id)}
                                {@const mod_version = mod.versions[0]}
                                <ModCard
                                    mod={mod} version={mod_version}
                                    style={view === 'dual-list' ? 'list' : view}
                                />
                            {/each}
                        </div>
                    {:else}
                        <div class="no-mod-listing">
                            <div class="humorous-meme"><Image name="no-mods" alt=""/></div>
                            <p><em>No matching mods found :(</em></p>
                            <p>
                                It could be that the mod 
                                you're looking for 
                                {#if platforms.size}
                                    is not available on {
                                        Array.from(platforms)
                                        .map(a => a.charAt(0).toUpperCase() + a.slice(1))
                                        .join(' / ')
                                    }!
                                {:else}
                                    is not available on Geode, or was made for an older version!
                                {/if}
                            </p>
                        </div>
                    {/if}
                {/if}
            </LoadingOverlay>

            {#if data.mods && data.mods.data.length > 0}
                <div class="show-more-container">
                    <Pagination
                        total={data.mods?.count ?? 0}
                        perPage={per_page}
                        pageCount={data.mods?.data.length ?? 0}
                        page={current_page}
                        disabled={!data.mods}
                        label="mods"
                        labelOne="mod"
                        on:select={(e) => gotoPage(e.detail.page)}
                    >
                        <Select title="Per page" titleIcon="eye" on:select={ev => {
                            const newValue = parseInt(ev.detail.value);
                            if (per_page != newValue) {
                                const scroll = newValue < per_page;
                                per_page = newValue;
                                updateSearch(scroll);
                            }
                        }}>
                            {#each perPageOptions as option}
                                <SelectOption icon="right" title={option.toString()} value={option.toString()} isDefault={option == per_page}/>
                            {/each}
                        </Select>
                    </Pagination>
                </div>
            {/if}
        </main>
    </Column>
</div>

<svelte:window on:keydown={onKeydown} />

<style lang="scss">
    @use '$lib/styles/media-queries.scss' as *;

    h1 {
        margin: 0;
        font-family: var(--font-heading);
        font-weight: 600;
        color: var(--text-50);
        font-size: var(--font-size-long-title);
    }
    .content-separator {
        display: grid;
        grid-template-columns: auto;
        align-items: start;
        gap: var(--gap-small);

        & main {
            display: grid;
            grid-template-columns: 1fr;

            padding: .5rem;
            border-radius: .5rem;

            background-color: var(--background-950);
        }
    }

    .filter-inline {
        display: inherit;
    }

    .filter-inline.collapsed {
        display: none;
    }

    .filter-column {
        display: none;
    }

    @media screen and (min-width: 830px) {
        .content-separator {
            grid-template-columns: 15rem max-content;
        }

        .filter-column {
            display: inherit;
        }

        .filter-inline,

        .toggle-filter-button {
            display: none;
        }
    }

    .show-more-container {
        margin-top: .5rem;
    }
    .mod-listing {
        gap: .5rem;

        &.grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(14rem, auto));
            align-content: center;
            justify-content: center;
        }
        &.dual-list {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(20rem, 1fr));
            align-content: center;
            justify-content: center;
        }

        @media screen and (min-width: 400px) {	
            &.dual-list {
                grid-template-columns: repeat(auto-fill, minmax(25rem, 1fr));
            }
        }

        &.list {
            display: flex;
            flex-direction: column;
        }
    }
    .no-mod-listing {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        padding: 5rem;
        gap: .5rem;

        & > .humorous-meme {
            max-width: min(20rem, 50vw);
        }
        & > p {
            margin: 0;
        }
    }
    .mod-listing-size-enforcer {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(14rem, auto));
        gap: .5rem;
        max-width: 60vw;
    }
    .search {
        background-color: var(--background-950);
        border-radius: .5rem;
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
        align-items: center;
        gap: var(--gap-small);
    }

    .search .search-filters {
        display: flex;
        justify-content: start;
        flex-wrap: wrap;
        align-items: center;
        gap: var(--gap-tiny);
    }
</style>
