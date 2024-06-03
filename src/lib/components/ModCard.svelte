<script lang="ts">
	import type { ServerMod } from "$lib/api/models/mod.js";
	import type { ServerModVersion } from "$lib/api/models/mod-version.js";
    import { getModLogo } from "$lib/api/index-repository";
    import Link from "./Link.svelte";
    import Button from "./Button.svelte";
    import Gap from "./Gap.svelte";

	export let mod: ServerMod;
	export let version: ServerModVersion;

	// add the version for non-accepted mods, as otherwise the endpoint will pick the latest accepted
	$: mod_url = version.status != "accepted"
		? `/mods/${mod.id}?version=${version.version}`
		: `/mods/${mod.id}`;

	$: owner = mod.developers.filter(d => d.is_owner)[0];
</script>
<div class="mod-background">
	<span class="click-to-go-to-page">
		<Link href={mod_url}><h1>{version.name}</h1></Link>
		<Link href={mod_url}>
			<img
				src={getModLogo(mod.id).toString()} alt={`Logo for the mod ${version.name}`}
				style="max-height: 6rem;"
			/>
		</Link>
	</span>
	<Link href={`/developers/${owner.id}`} --link-color="var(--accent-300)">{owner.display_name}</Link>
	<p>{version.version}</p>
	<Gap size="small"/>
	<p class="description">{version.description}</p>
</div>

<style lang="scss">
	h1 {
		margin: 0;
		font-size: 1.35em;
		font-family: var(--font-heading);
		text-align: center;
	}
	.description {
		font-size: .9em;
		color: var(--text-300);
		flex-grow: 1;
	}
	.mod-background {
		background-color: color-mix(in srgb, var(--background-500) 15%, transparent);
		height: 18rem;
		width: 12rem;

		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: var(--gap-tiny);

		transition-duration: var(--transition-duration);
		
		padding: 1rem;
		border-radius: .5rem;

		& .click-to-go-to-page {
			display: contents;
		}

		&:has(.click-to-go-to-page a:hover) {
			background-color: color-mix(in srgb, var(--background-500) 40%, transparent);
		}
	}
</style>