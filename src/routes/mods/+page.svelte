<script lang="ts">
	import { goto } from "$app/navigation";
	import { page } from "$app/stores";
	import type { PageData } from "./$types.js";

	import ModCard from "$lib/components/ModCard.svelte";

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

<fieldset>
	<legend>Search Filters</legend>

	<form on:submit|preventDefault={onSearch}>
			<div>
				<input type="search" name="search" bind:value={query} />
			</div>

			<select name="platform" multiple bind:value={platforms}>
				<option value="windows">Windows</option>
				<option value="mac">macOS</option>
				<option value="android64">Android (64-bit)</option>
				<option value="android32">Android (32-bit)</option>
				<option value="ios">iOS</option>
			</select>


			<select name="sort" bind:value={sort}>
				<option value="downloads">Downloads</option>
				<option value="recently_updated">Recently Updated</option>
				<option value="recently_published">Recently Published</option>
				<option value="name">Name</option>
				<option value="name_reverse">Name (Reversed)</option>
			</select>

			<select name="tags" multiple bind:value={tags}>
				{#each data.tags as tag}
					<option value={tag} style="text-transform: capitalize;">{tag}</option>
				{/each}
			</select>

			<div>
				<input type="checkbox" name="featured" id="featured" bind:checked={featured}/>
				<label for="featured">Show featured mods only</label>
			</div>

			<div>
				<input type="checkbox" name="pending" id="pending" bind:checked={pending} />
				<label for="pending">Show pending mods</label>
			</div>

			<button type="submit">Search</button>

			{#if data.error}
			<small>
				Error: {data.error}
			</small>
			{/if}
	</form>
</fieldset>

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

<div>
	<button on:click={onPrevPage}>Previous</button>
	<span>Page {current_page} of {max_page}</span>
	<button on:click={onNextPage}>Next</button>
</div>

<style>
	.mod-listing {
		display: flex;
		flex: 1;
		flex-direction: row;
		flex-wrap: wrap;
		gap: 1.5rem;
		align-items: center;
	}
</style>