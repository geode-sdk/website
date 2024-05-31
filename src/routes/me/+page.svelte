<script lang="ts">
	import type { PageData } from "./$types.js";
	import { goto } from "$app/navigation";

	export let data: PageData;

	let status = "accepted";

	const onChangeFilter = async () => {
		const params = new URLSearchParams();

		params.set("status", status);

		await goto(`/me?${params}`);
	}
</script>

<fieldset>
	<legend>it's you!</legend>

	{data.self.display_name} ({data.self.username}) ((#{data.self.id}))

	<p>
		admin: {data.self.admin} <br />
		verified: {data.self.verified} <br />
	</p>

	<form method="post" action="?/update_self">
		<label for="update_display_name">Display name:</label>
		<input type="text" value={data.self.display_name} name="display_name" id="update_display_name" />

		<input type="submit" value="Update" />
	</form>

	<form method="POST">
		<button formaction="?/logout">Log out</button>
		<button formaction="?/logout_all">Revoke all tokens</button>
	</form>
</fieldset>

<div>
	<h2>Your mods :)</h2>

	<label for="status">Mod Status</label>
	<select name="status" id="status" bind:value={status}>
		<option value="accepted">Accepted</option>
		<option value="pending">Pending</option>
		<option value="rejected">Rejected</option>
		<option value="unlisted">Unlisted</option>
	</select>

	<button on:click={onChangeFilter}>Update filter</button>

	<div>
		{#each data.mods as mod}
			{@const version = mod.versions[0]}
			{version.name}
		{/each}
	</div>
</div>
