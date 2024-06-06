<script lang="ts">
	import type { ServerMod } from "$lib/api/models/mod.js";
	import type { ServerModVersion } from "$lib/api/models/mod-version.js";
    import { getModLogo } from "$lib/api/index-repository";
    import Link from "./Link.svelte";
    import Gap from "./Gap.svelte";
    import Row from "./Row.svelte";
    import Icon from "./Icon.svelte";
    import Column from "./Column.svelte";
    import { serverTimestampToAgoString } from "$lib";

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
		<Column gap="small">
			<Link href={mod_url}>
				<span class="title-container">
					<h1 class:small={version.name.length > 16}>{version.name}</h1>
				</span>
			</Link>
			<Link href={mod_url}>
				<img
					src={getModLogo(mod.id).toString()}
					alt={`Logo for the mod ${version.name}`}
					style="max-height: 6rem;"
				/>
			</Link>
		</Column>
	</span>
	<Link href={`/developers/${owner.id}`} --link-color="var(--accent-300)">{owner.display_name}</Link>
	<Gap size="small"/>
	<Row>
		<span class="card-info"><Icon icon="version"/>{version.version}</span>
		<span class="card-info"><Icon icon="download"/>{mod.download_count}</span>
	</Row>
	<Gap size="tiny"/>
	<p class="description">
		{#if version.description}
			{#if version.description?.length < 80}
				{version.description}
			{:else}
				{version.description.substring(0, 80)}&#8230;
			{/if}
		{:else}
			<i>{"Description not provided"}</i>
		{/if}
	</p>
</div>

<style lang="scss">
	.title-container {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 1.55em;

		h1 {
			margin: 0;
			font-size: 1.35em;
			font-family: var(--font-heading);
			text-align: center;

			&.small {
				font-size: 1.05em;
			}
		}
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

		transition-duration: var(--transition-duration);
		
		padding: 1rem;
		border-radius: .5rem;

		& .click-to-go-to-page {
			display: contents;

			& img {
				transition-duration: var(--transition-duration);
			}
		}
		&:has(.click-to-go-to-page a:hover) {
			background-color: color-mix(in srgb, var(--background-500) 40%, transparent);

			& .click-to-go-to-page img {
				transform: scale(115%);
			}
			& h1 {
				color: var(--primary-100);
			}
			& :global(.icon) {
				color: var(--primary-100);
			}
		}
	}
	.card-info {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: .25em;
		
		& :global(.icon) {
			--icon-size: 1.1em;
			color: var(--secondary-300);
			transition-duration: var(--transition-duration);
		}
	}
</style>