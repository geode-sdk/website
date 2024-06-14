<script lang="ts">
    import { goto } from "$app/navigation";
    import { page } from "$app/stores";
    import type { PageData } from "./$types.js";

    import ModCard from "$lib/components/ModCard.svelte";
    import Gap from "$lib/components/Gap.svelte";
    import Column from "$lib/components/Column.svelte";
    import SelectButton from "$lib/components/SelectButton.svelte";
    import Icon from "$lib/components/Icon.svelte";
    import { iconForTag } from "$lib/index.js";
    import Row from "$lib/components/Row.svelte";
    import Select from "$lib/components/Select.svelte";
    import Search from "$lib/components/Search.svelte";
    import SelectOption from "$lib/components/SelectOption.svelte";
    import Rollover from "$lib/components/Rollover.svelte";
    import Waves from "$lib/components/Waves.svelte";
    import Button from "$lib/components/Button.svelte";
    import LoadingCircle from "$lib/components/LoadingCircle.svelte";
    import Image from "$lib/components/Image.svelte";
    import InfoBox from "$lib/components/InfoBox.svelte";

    export let data: PageData;

    $: url_params = $page.url.searchParams;
    $: current_page = data.params.page ?? 1;

    let query = data.params.query ?? "";
    $: platforms = new Set(data.params.platforms ?? []);
    let sort = data.params.sort ?? "downloads";
    let tags = new Set(data.params.tags ?? []);
    let featured = data.params.featured ?? false;
    let developer = data.params.developer ?? "";
    let pending = data.params.status != "accepted";
    let gd = data.params.gd ?? "";
    let per_page = data.params.per_page ?? 12;
    let searching = false;
    let view: 'list' | 'dual-list' | 'grid' = 'dual-list';

    $: max_count = data.mods?.count ?? 0;
    $: max_page = Math.floor(max_count / per_page) + 1;

    const perPageOptions = [10, 15, 25];

    function toggleSet<T>(set: Set<T>, value: T) {
        set.has(value) ? set.delete(value) : set.add(value);
    }

    const updateSearch = async () => {
        console.log(new Error().stack);

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
        if (developer) {
            params.set("developer", developer);
        }
        if (gd) {
            params.set("gd", gd);
        }
        params.set("sort", sort);

        await goto(`/mods?${params}`, { noScroll: true });
        searching = false;
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
    }
</script>

<svelte:head>
    <title>Browse Geode Mods</title>
    <meta name="description" content="Browse mods for the Geode mod loader">
</svelte:head>

<Waves type="top" />
<Gap size="large" />

<h1>Browse Mods</h1>

<div class="content-separator">
    <aside>
        <header><Icon icon="filter" --icon-size=1.2em/>Search Filters</header>
        <nav>
            <Rollover title="Platform">
                <SelectButton
                    icon="windows"
                    selected={platforms.has('windows')}
                    on:select={() => {
                        toggleSet(platforms, 'windows');
                        updateSearch();
                    }}
                >Windows</SelectButton>
                <SelectButton
                    icon="mac"
                    selected={platforms.has('mac-arm')}
                    on:select={() => {
                        toggleSet(platforms, 'mac-arm');
                        updateSearch();
                    }}
                >macOS (ARM)</SelectButton>
                <SelectButton
                    icon="mac"
                    selected={platforms.has('mac-intel')}
                    on:select={() => {
                        toggleSet(platforms, 'mac-intel');
                        updateSearch();
                    }}
                >macOS (x64)</SelectButton>
                <SelectButton
                    icon="android"
                    selected={platforms.has('android64')}
                    on:select={() => {
                        toggleSet(platforms, 'android64');
                        updateSearch();
                    }}
                >Android (64-bit)</SelectButton>
                <SelectButton
                    icon="android"
                    selected={platforms.has('android32')}
                    on:select={() => {
                        toggleSet(platforms, 'android32');
                        updateSearch();
                    }}
                >Android (32-bit)</SelectButton>
                <SelectButton
                    icon="ios"
                    selected={platforms.has('ios')}
                    on:select={() => {
                        toggleSet(platforms, 'ios');
                        updateSearch();
                    }}
                >iOS</SelectButton>
            </Rollover>

            <Rollover title="Tags">
                {#if data.tags}
                    {#each data.tags as tag}
                        <SelectButton
                            icon={iconForTag(tag)}
                            selected={tags.has(tag)}
                            on:select={() => {
                                toggleSet(tags, tag);
                                updateSearch();
                            }}>
                            {tag.charAt(0).toUpperCase() + tag.slice(1)}
                        </SelectButton>
                    {/each}
                {:else}
                    <InfoBox type="error">Unable to connect to servers!</InfoBox>
                {/if}
            </Rollover>

            <Rollover title="Other">
                <SelectButton
                    icon="featured"
                    bind:selected={featured} on:select={updateSearch}
                >Featured only</SelectButton>
                <SelectButton
                    icon="unverified"
                    bind:selected={pending} on:select={updateSearch}
                >Unverified only</SelectButton>
            </Rollover>
        </nav>
    </aside>

    <Column align="stretch" gap="small">
        <nav class="search">
            <Search placeholder="Search mods..." bind:query on:search={updateSearch} autofocus></Search>
            <Select title="Sort by" titleIcon="sort" on:select={ev => {
                if (sort != ev.detail.value) {
                    sort = ev.detail.value;
                    updateSearch();
                }
            }}>
                <SelectOption icon="download" title="Most Downloaded" value="downloads" isDefault/>
                <SelectOption icon="time" title="Most Recent" value="recently_published"/>
                <SelectOption icon="time" title="Recently Updated" value="recently_updated"/>
                <SelectOption icon="sort-abc" title="Name (A-Z)" value="name"/>
                <SelectOption icon="sort-cba" title="Name (Z-A)" value="name_reverse"/>
            </Select>
        </nav>

        <main>
            <nav>
                {#if data.mods?.data.length === data.mods?.count}
                    <p>Showing {data.mods?.data.length ?? 0} mods</p>
                {:else}
                    <p>Showing {data.mods?.data.length ?? 0} of {data.mods?.count ?? 0} mods</p>
                {/if}
                <Row>
                    <Button
                        on:click={async () => await gotoPage(Math.max(current_page - 1, 1))}
                        icon="left" style="dark-small"
                        disabled={!data.mods || max_count == 0 || current_page == 1}
                    />
                    <span>Page {current_page} of {max_page}</span>
                    <Button
                        on:click={async () => await gotoPage(Math.min(current_page + 1, max_page))}
                        icon="right" style="dark-small"
                        disabled={!data.mods || max_count == 0 || current_page == max_page}
                    />
                </Row>
                <Row gap="small">
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
            </nav>
    
            <span class="overlay-container">
                <div class="overlay" class:hidden={!searching}>
                    <span><LoadingCircle/></span>
                </div>
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
            </span>

            {#if
                data.mods && data.mods.data.length < data.mods.count &&
                per_page !== perPageOptions[perPageOptions.length - 1]
            }
                <div class="show-more-container">
                    <Button style="primary-filled" on:click={() => {
                        per_page = perPageOptions[perPageOptions.indexOf(per_page) + 1];
                        updateSearch();
                    }}>Show more ({perPageOptions[perPageOptions.indexOf(per_page) + 1]})</Button>
                </div>
            {:else if data.mods && data.mods.data.length > 0}
                <div class="show-more-container">
                    <Button style="secondary-filled" on:click={() => {
                        per_page = perPageOptions[0];
                        updateSearch();
                    }}>Show less (10)</Button>
                </div>
            {/if}
        </main>
    </Column>
</div>

<style lang="scss">
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

        & > aside {
            background-color: var(--background-950);
            padding: .5rem;
            gap: .5rem;
            border-radius: .5rem;

            display: flex;
            flex-direction: column;
            align-items: stretch;

            & > header {
                display: flex;
                flex-direction: row;
                align-items: center;
                color: var(--text-300);
                font-size: .9em;
                gap: var(--gap-small);
            }
            & > nav {
                display: flex;
                flex-direction: column;
                gap: var(--gap-small);
            }
        }
        & main {
            display: grid;
            grid-template-columns: 1fr;

            padding: .5rem;
            border-radius: .5rem;

            background-color: var(--background-950);

            & > nav {
                // display: grid;
                display: flex;
                flex-wrap: wrap;
                justify-content: center;
                // grid-template-columns: 1fr max-content 1fr;
                align-items: center;
                gap: 1rem;

                & :global(*:last-child) {
                    justify-self: end;
                }
            }
        }
    }

    @media screen and (min-width: 830px) {
        .content-separator {
            grid-template-columns: 15rem max-content;
        }
    }

    .show-more-container {
        display: flex;
        align-self: center;
        justify-self: center;
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
    .overlay-container {
        position: relative;
    }
    .overlay {
        position: absolute;
        width: 100%;
        height: 100%;

        display: flex;
        align-items: center;
        justify-content: center;

        background-color: color-mix(in srgb, var(--background-950) 80%, transparent);

        &.hidden {
            display: none;
            pointer-events: none;
        }
    }
</style>
