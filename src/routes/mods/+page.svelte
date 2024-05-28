<script lang="ts">
	import { goto } from "$app/navigation";
	import { page } from "$app/stores";
	import type { PageData } from "./$types.js";

	export let data: PageData;

	$: url_params = $page.url.searchParams;
	$: current_page = data.params.page ?? 1;
	$: items_per_page = data.params.per_page ?? 10;
	let query = data.params.query ?? "";

	$: max_count = data.mods.count;

	$: max_page = Math.ceil(max_count / items_per_page);

	const onSearch = async () => {
		const params = new URLSearchParams();

		if (query) {
			params.set("query", query);
		}

		params.set("page", "1");

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

<form on:submit|preventDefault={onSearch}>
    <input type="search" name="search" bind:value={query} />
		<button type="submit">Search</button>
</form>

{#each data.mods.data as mod}
	{@const mod_version = mod.versions[0]}
	<div>
		<a href={`/mods/${mod.id}`}>
			{mod_version.name}
		</a>
	</div>
{/each}

<div>
	<button on:click={onPrevPage}>Previous</button>
	<span>Page {current_page} of {max_page}</span>
	<button on:click={onNextPage}>Next</button>
</div>
