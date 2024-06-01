<script lang="ts">
	import { goto } from "$app/navigation";
	import { page } from "$app/stores";
	import { enhance } from '$app/forms';
	import type { PageData, ActionData } from "./$types.js";
	import ModCard from '$lib/components/ModCard.svelte';

	export let data: PageData;
	export let form: ActionData;

	$: url_params = $page.url.searchParams;

	$: current_page = data.params.page;
	$: items_per_page = data.params.per_page;

	$: max_count = data.mods?.count ?? 0;
	$: max_page = Math.floor(max_count / items_per_page) + 1;

	const gotoPage = async (page: number) => {
		if (current_page < 1) {
			page = 0;
		}

		if (current_page > max_page) {
			page = max_page;
		}

		const params = new URLSearchParams(url_params);
		params.set("page", page.toString());

		await goto(`/developers/${data.developer.id}/?${params}`);
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

	const can_update_user = data.user && data.user.id == data.developer.id || false;
	const can_modify_user = data.user?.admin || false;

</script>


{data.developer.display_name} ({data.developer.id})

<a href={`https://github.com/${data.developer.username}`}>github</a>

{#if can_update_user}
<a href="/me">User Settings</a>
{/if}

<div>
	<div>
		<form>
			<label for="status">Mod Status:</label>
			<select name="status" id="status" bind:value={data.params.status}>
				<option value="accepted">Accepted</option>
				<option value="pending">Pending</option>
				<option value="rejected">Rejected</option>
				<option value="unlisted">Unlisted</option>
			</select>

			<input type="submit" value="Set filter" />

		</form>
	</div>

	{#if data.error}
	<small>Error loading page: {data.error}</small>
	{/if}

	{#if form?.message}
		<small>Error submitting form: {form.message}</small>
	{/if}

	{#if data.self_mods}
	<div>
		<h2>Your mods</h2>

		<form method="POST" action="?/upload_mod" use:enhance>
			<fieldset>
				<legend>Create new mod</legend>

				<label for="create-mod-download">Download link:</label>
				<input type="url" id="create-mod-download" name="download_link" />

				<input type="submit" value="Create" />
			</fieldset>
		</form>

		{#each data.self_mods as mod}
			<p>
				{mod.versions[0].name}
			</p>
		{/each}
	</div>
	{:else if data.mods}
	<div>
		<h2>Mods by this user</h2>

		{#each data.mods.data as mod}
			{@const version = mod.versions[0]}
			<ModCard mod={mod} version={version} />
		{/each}

		<button on:click={onPrevPage}>Previous</button>
		<span>Page {current_page} of {max_page}</span>
		<button on:click={onNextPage}>Next</button>
	</div>
	{/if}
</div>
