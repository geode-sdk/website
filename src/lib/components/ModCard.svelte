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
	export let style: 'list' | 'grid' = 'grid';

	// add the version for non-accepted mods, as otherwise the endpoint will pick the latest accepted
	$: mod_url = version.status != "accepted"
		? `/mods/${mod.id}?version=${version.version}`
		: `/mods/${mod.id}`;

	$: owner = mod.developers.filter(d => d.is_owner)[0];
</script>
<div class="mod-background {style}">
	{#if style === 'list'}
		<span class="click-to-go-to-page">
			<Link href={mod_url} centered={true}>
				<img
					src={getModLogo(mod.id).toString()}
					alt={`Logo for the mod ${version.name}`}
					style="max-height: 6rem;"
				/>
			</Link>
		</span>
		<Gap size="normal"/>
		<Column align="left" gap="tiny">
			<span class="click-to-go-to-page">
				<Link href={mod_url}>
					<span class="title-container">
						<h1 class:small={version.name.length > 16}>{version.name}</h1>
					</span>
				</Link>
			</span>
			<Link href={`/developers/${owner.id}`} --link-color="var(--accent-300)">{owner.display_name}</Link>
			<p class="description">
				{#if version.description}
					{#if version.description?.length < 110}
						{version.description}
					{:else}
						{version.description.substring(0, 110)}&#8230;
					{/if}
				{:else}
					<i>{"Description not provided"}</i>
				{/if}
			</p>
		</Column>
		<Gap size="flex"/>
		<Gap size="small"/>
		<span class="do-not-shrink">
			<Column align="right" gap="tiny">
				<span class="card-info"><Icon icon="version"/>{version.version}</span>
				<span class="card-info"><Icon icon="download"/>{mod.download_count}</span>
				<span class="card-info"><Icon icon="time"/>{serverTimestampToAgoString(mod.updated_at)}</span>
			</Column>
		</span>
	{:else}
		<span class="click-to-go-to-page">
			<Column gap="small">
				<Link href={mod_url}>
					<span class="title-container">
						<h1 class:small={version.name.length > 16}>{version.name}</h1>
					</span>
				</Link>
				<Link href={mod_url} centered={true}>
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
	{/if}
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

		display: flex;
		align-items: center;

		&.grid {
			height: 18rem;
			width: 12rem;
			flex-direction: column;
			justify-content: center;
		}
		&.list {
			width: calc(100% - 2rem);
			height: 6rem;
			flex-direction: row;
			justify-content: start;
		}

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
				color: var(--accent-300);
			}
			& :global(.icon) {
				color: var(--primary-300);
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
	.do-not-shrink {
		flex-shrink: 0;
	}
</style>