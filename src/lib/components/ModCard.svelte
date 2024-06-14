<script lang="ts">
	import type { ServerMod } from "$lib/api/models/mod.js";
	import type { ServerModVersion } from "$lib/api/models/mod-version.js";
    import { getModLogo } from "$lib/api/index-repository";
    import Link from "./Link.svelte";
    import Gap from "./Gap.svelte";
    import Row from "./Row.svelte";
    import Icon from "./Icon.svelte";
    import Column from "./Column.svelte";
    import { serverTimestampToAgoString, abbreviateNumber } from "$lib";
	import iconPlaceholder from "$lib/assets/icon-placeholder.png"

	export let mod: ServerMod;
	export let version: ServerModVersion;
	export let style: 'list' | 'grid' = 'grid';

	// add the version for non-accepted mods, as otherwise the endpoint will pick the latest accepted
	$: mod_url = version.status != "accepted"
		? `/mods/${mod.id}?version=${version.version}`
		: `/mods/${mod.id}`;

	$: logo_url = getModLogo(mod.id).toString();

	$: owner = mod.developers.filter(d => d.is_owner)[0];
</script>
<div class="mod-background {style}">
	{#if style === 'list'}
		<div class="left">
			<span class="click-to-go-to-page">
				<Link href={mod_url} centered={true}>
					<object type="image/png" data={logo_url} title={`Logo for the mod ${version.name}`} class="mod-image">
						<img src={iconPlaceholder} alt={`Placeholder logo for the mod ${version.name}`} class="mod-image" />
					</object>
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
		</div>
		<span class="do-not-shrink right">
			<Column align="right" gap="tiny">
				<span class="card-info"><Icon icon="version"/>{version.version}</span>
				<span class="card-info"><Icon icon="download"/>{abbreviateNumber(mod.download_count)}</span>
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
					<object type="image/png" data={logo_url} title={`Logo for the mod ${version.name}`} style="max-height: 6rem;">
						<img src={iconPlaceholder} alt={`Placeholder logo for the mod ${version.name}`} style="max-height: 6rem;" />
					</object>
				</Link>
			</Column>
		</span>
		<Link href={`/developers/${owner.id}`} --link-color="var(--accent-300)">{owner.display_name}</Link>
		<Gap size="small"/>
		<Row>
			<span class="card-info"><Icon icon="version"/>{version.version}</span>
			<span class="card-info"><Icon icon="download"/>{abbreviateNumber(mod.download_count)}</span>
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

		display: -webkit-box;
		max-width: 200px;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
	.mod-image {
		max-height: 5rem;
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

			.description {
				-webkit-line-clamp: 4;
			}
		}
		&.list {
			flex-direction: row;
			justify-content: space-between;

			.left {
				display: flex;
			}

			.right {
				display: none;
			}

			@media screen and (min-width: 450px) {
				.right {
					display: flex;
				}	
			}


			.title-container h1 {
				text-align: left;
			}
		}

		transition-duration: var(--transition-duration);
		
		padding: 1rem;
		border-radius: .5rem;

		& .click-to-go-to-page {
			display: contents;

			& > :global(*) {
				flex-shrink: 0;
			}

			& object {
				transition-duration: var(--transition-duration);
				pointer-events: none;
			}
		}
		&:has(.click-to-go-to-page a:hover) {
			background-color: color-mix(in srgb, var(--background-500) 40%, transparent);

			& .click-to-go-to-page object {
				transform: scale(110%);
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