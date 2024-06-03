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

	export let data: PageData;

	$: url_params = $page.url.searchParams;
	$: current_page = data.params.page ?? 1;
	$: items_per_page = data.params.per_page ?? 10;

	let query = data.params.query ?? "";
	let platforms = data.params.platforms ?? [];
	let sort = data.params.sort ?? "downloads";
	let tags = data.params.tags ?? [];
	let featured = data.params.featured ?? false;
	let pending = data.params.status != "accepted";
	let per_page = data.params.per_page;

	$: max_count = data.mods?.count ?? 0;

	$: max_page = Math.floor(max_count / items_per_page) + 1;

	const onSearch = async () => {
		const params = new URLSearchParams();

		if (query) {
			params.set("query", query);
		}

		if (platforms.length > 0) {
			for (const platform of platforms) {
				params.append("platform", platform);
			}
		}

		if (tags.length > 0) {
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

		params.set("sort", sort);

		await goto(`/mods?${params}`);
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

		await goto(`/mods?${params}`);
	}

	const onNextPage = async () => {
		if (current_page == max_page) {
			return;
		}

		await gotoPage(current_page + 1);
	}

	const onPrevPage = async () => {
		if (current_page == 1) {
			return;
		}

		await gotoPage(current_page - 1);
	}
</script>

<Waves type="top" />
<Gap size="large" />

<h1>Browse Mods</h1>

<div class="content-separator">
	<aside>
		<header><Icon icon="filter" --icon-size=1.2em/>Search Filters</header>
		<nav>
			<Rollover title="Platform">
				<SelectButton icon="windows">Windows</SelectButton>
				<SelectButton icon="mac">Mac (Apple Silicon)</SelectButton>
				<SelectButton icon="mac">Mac (Intel)</SelectButton>
				<SelectButton icon="android">Android (64-bit)</SelectButton>
				<SelectButton icon="android">Android (32-bit)</SelectButton>
				<SelectButton icon="mac">iOS</SelectButton>
			</Rollover>

			<Rollover title="Tags">
				{#each data.tags as tag}
					<SelectButton icon={iconForTag(tag)}>
						{tag.charAt(0).toUpperCase() + tag.slice(1)}
					</SelectButton>
				{/each}
			</Rollover>

			<Rollover title="Other">
				<SelectButton icon="featured">Featured only</SelectButton>
				<SelectButton icon="unverified">Show Unverified</SelectButton>
			</Rollover>
		</nav>
	</aside>

	<Column align="stretch" gap="small">
		<nav class="search">
			<Search placeholder="Search mods..."></Search>
			<Select title="Sort by" titleIcon="sort">
				<SelectOption icon="download" title="Most Downloaded" value="downloads" isDefault/>
				<SelectOption icon="time" title="Most Recent" value="recently_published"/>
				<SelectOption icon="time" title="Recently Updated" value="recently_updated"/>
				<SelectOption icon="sort-abc" title="Name (A-Z)" value="name"/>
				<SelectOption icon="sort-cba" title="Name (Z-A)" value="name_reverse"/>
			</Select>
		</nav>

		<nav class="page">
			<span>Mods per page: </span>
			<select name="show-count" bind:value={per_page} on:change={onSearch}>
				<option value={10}>10</option>
				<option value={25}>25</option>
				<option value={50}>50</option>
			</select>
			<Gap size="normal"/>
			<button on:click={onPrevPage}>Previous</button>
			<span>Page {current_page} of {max_page}</span>
			<button on:click={onNextPage}>Next</button>
		</nav>

		<main>
			{#if data.mods && max_count > 0}
				<div class="mod-listing">
					{#each data.mods.data as mod}
						{@const mod_version = mod.versions[0]}
						<ModCard mod={mod} version={mod_version} />
					{/each}
				</div>
			{:else}
				No mods found :(
			{/if}
		</main>
	</Column>
</div>

<style>
    h1 {
        margin: 0;
        font-family: var(--font-heading);
        font-weight: 600;
        color: var(--text-50);
        font-size: var(--font-size-long-title);
    }
	.content-separator {
        display: grid;
        grid-template-columns: 15rem 1fr;
        align-items: start;
        min-height: 1500px;
        gap: var(--gap-small);
		max-width: 74rem;

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
			background-color: var(--background-950);
			padding: .5rem;
			gap: .5rem;
			border-radius: .5rem;
		}
	}
	.mod-listing {
		display: flex;
		flex: 1;
		flex-direction: row;
		flex-wrap: wrap;
		gap: .5rem;
	}
	.page {
		background-color: var(--background-950);
		border-radius: .5rem;
		padding: .75rem;
	}
	.search {
		background-color: var(--background-950);
		border-radius: .5rem;
        display: grid;
        grid-template-columns: 1fr auto;
		align-items: center;
        gap: var(--gap-small);
	}
</style>
