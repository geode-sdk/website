<script lang="ts">
	import type { PageData } from "./$types.js";
	import SvelteMarkdown from "svelte-markdown";
	import { getModLogo } from "$lib/api/index-repository.js";

	export let data: PageData;

	const logoUrl = getModLogo(data.mod.id).toString();

	const developer_ids = data.mod.developers.map(d => d.id);
	const can_update_mod = data.user && developer_ids.includes(data.user.id) || false;
	const can_modify_mod = data.user?.admin || false;
</script>

<svelte:head>
	<title>{data.version.name}</title>
	<meta property="og:title" content={data.version.name} />
	<meta property="og:image" content={logoUrl} />
	<meta property="og:image:width" content="80" />
	<meta property="og:image:height" content="80" />
</svelte:head>

<h1>{data.version.name} [v{data.version.version}]</h1>

<img src={logoUrl} alt={`mod logo for ${data.version.name}`} style="max-height: 8rem;" />


{#if can_modify_mod}
<form method="POST" action="?/update_mod">
	<fieldset>
		<legend>Update mod info</legend>

		<div>
			<input type="checkbox" checked={data.mod.featured} name="featured" id="update-mod-featured" />
			<label for="update-mod-featured">Featured</label>
		</div>

		<input type="submit" value="Update" />
	</fieldset>
</form>
<form method="POST" action="?/update_mod_version">
	<fieldset>
		<legend>Update version status</legend>

		<div>
			<label for="update-version-status">Status:</label>
			<select name="status" id="update-version-status" value={data.version.status}>
				<option value="accepted">Accepted</option>
				<option value="pending">Pending</option>
				<option value="rejected">Rejected</option>
				<option value="unlisted">Unlisted</option>
			</select>
		</div>

		<div>
			<label for="update-version-info">Reason:</label> <br />
			<textarea name="info" id="update-version-info"></textarea>
		</div>

		<input type="hidden" name="mod_version" value={data.version.version} />

		<input type="submit" value="Update" />
	</fieldset>
</form>
{/if}

{#if can_update_mod}
<form method="POST" action="?/create_version">
	<fieldset>
		<legend>Create new version</legend>

		<label for="create-mod-download">Download link:</label>
		<input type="url" id="create-mod-download" name="download_link" />

		<input type="submit" value="Create" />
	</fieldset>
</form>
{/if}

<a href={data.version.download_link}>Download</a>

<div class="markdown">
	<SvelteMarkdown source={data.mod.about} />
</div>
