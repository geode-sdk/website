<script lang="ts">
	import type { ServerMod } from "$lib/api/models/mod.js";
	import type { ServerModVersion } from "$lib/api/models/mod-version.js";
    import { getModLogo } from "$lib/api/index-repository";

	export let mod: ServerMod;
	export let version: ServerModVersion;

	// add the version for non-accepted mods, as otherwise the endpoint will pick the latest accepted
	const mod_url = version.status != "accepted"
		? `/mods/${mod.id}?version=${version.version}`
		: `/mods/${mod.id}`;
</script>

<div class="mod-background">
	<div>
		{version.name}
	</div>

	<div>
		{mod.developers[0].display_name} {version.version}
	</div>

	<div>
		<img
			src={getModLogo(mod.id).toString()} alt={`mod logo for ${version.name}`}
			style="max-height: 6rem;"
		/>
	</div>

	<div>
		{version.description}
	</div>

	<div>
		<a class="view-btn" href={mod_url}>
			View
		</a>
	</div>
</div>

<style>
	.mod-background {
		background-color: rgb(34, 34, 34);
		height: 18rem;
		width: 14rem;
		flex-direction: column;
		padding: 1rem;
		border-radius: .375rem;
	}

	.view-btn {
		border-radius: 9999px;
		background-color: rgb(51, 51, 51);
		color: rgb(238, 238, 238);
		padding: .5rem 3rem;
		text-decoration: inherit;
	}
</style>