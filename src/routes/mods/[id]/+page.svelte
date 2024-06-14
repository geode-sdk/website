<script lang="ts">
	import SvelteMarkdown from "svelte-markdown";
	import { enhance } from '$app/forms';
	import type { PageData, ActionData } from "./$types.js";
	import { getModLogo } from "$lib/api/index-repository.js";
    import Row from "$lib/components/Row.svelte";
    import Column from "$lib/components/Column.svelte";
    import Button from "$lib/components/Button.svelte";
    import Tabs from "$lib/components/Tabs.svelte";
    import TabPage from "$lib/components/TabPage.svelte";
    import Link from "$lib/components/Link.svelte";
    import Icon from "$lib/components/Icon.svelte";
	import Gap from "$lib/components/Gap.svelte";
    import { abbreviateNumber, serverTimestampToAgoString } from "$lib";
    import Waves from "$lib/components/Waves.svelte";
    import Label from "$lib/components/Label.svelte";
    import InfoBox from "$lib/components/InfoBox.svelte";
	import iconPlaceholder from "$lib/assets/icon-placeholder.png";
    import VersionCards from "$lib/components/VersionCards.svelte";

	export let data: PageData;

	const logoUrl = getModLogo(data.mod.id).toString();

	const developer_ids = data.mod.developers.map(d => d.id);
	const can_update_mod = data.user && developer_ids.includes(data.user.id) || false;
	const can_modify_mod = data.user?.admin || false;

	data.mod.versions.forEach(version => version.download_link)

	export let form: ActionData;
</script>

<svelte:head>
	<title>{data.version.name}</title>
	<meta property="og:title" content={data.version.name} />
	<meta property="og:image" content={logoUrl} />
	<meta property="og:image:width" content="80" />
	<meta property="og:image:height" content="80" />
</svelte:head>

<Waves type="top" />
<Gap size="large" />

<header>
	<object type="image/png" data={logoUrl} title={`mod logo for ${data.version.name}`} style="max-height: 8rem;">
		<img src={iconPlaceholder} alt={`placeholder logo for ${data.version.name}`} style="max-height: 8rem;" />
	</object>

	<Column align="left" gap="tiny">
		<h1>{data.version.name}</h1>
		<p>
			{#each data.mod.developers as dev, index}
				{index > 0 ? ', ' : ''}<Link href={`/developers/${dev.id}`} --link-color="var(--accent-300)">{dev.display_name}</Link>
			{/each}
		</p>
	</Column>
</header>


{#if form?.message}
<div>Failed to perform action: {form.message}</div>
{/if}

{#if form?.success}
<div>Action performed!</div>
{/if}

<Row align="top" wrap="wrap-reverse" gap="small">
	<section>
		<Tabs>
			<TabPage name="Description" id="description" icon="description">
				<div class="markdown">
					<SvelteMarkdown source={data.mod.about ?? 'No description provided'} />
				</div>
			</TabPage>
			<TabPage name="Changelog" id="changelog" icon="changelog">
				<div class="markdown">
					<SvelteMarkdown source={data.mod.changelog ?? 'No changelog provided'} />
				</div>
			</TabPage>
			<TabPage name="Versions" id="versions" icon="version">
				<Column gap="small" align="stretch">
					<Column align="center">
						<InfoBox type="warning">
							The recommended way to install mods is through the <em>in-game mod loader</em>. 
							You will have to <em>manually install</em> the <code>.geode</code> files you get from this page. 
							<br><br>
							Some mods also require other mods as <em>dependencies</em>; you will need to find and install them yourself.
						</InfoBox>
					</Column>
					<Column gap="small" align="stretch" reverse>
						{#each data.mod.versions as version}
							<article class="version">
								<Row wrap="wrap">
									<Column gap="small" align="left">
										<h2>{version.version}</h2>
										<!-- <span class="card-info"><Icon icon="time"/>{"Released " + serverTimestampToAgoString("19")}</span> -->
										<span class="card-info"><Icon icon="download"/>{abbreviateNumber(version.download_count)} downloads</span>
										<span class="card-info"><Icon icon="geode"/>
											Minimum Geode version: <Label icon="geode" style="gray">{version.geode}</Label>
										</span>
										<span class="card-info">
											<VersionCards gd={version.gd} longForm={true} />
										</span>
									</Column>
									<Column gap="small" align="stretch">
										<Button href={version.download_link} icon="download" style="primary-filled">Download .geode file</Button>
										<Button href="/faq#how-do-i-manually-install-mods" icon="help">How to install</Button>
									</Column>
								</Row>
							</article>
						{/each}
					</Column>
				</Column>
			</TabPage>
			{#if can_modify_mod || can_update_mod}
				<TabPage name="Modify" id="modify" icon="modify">
					{#if can_modify_mod}
						<form method="POST" action="?/update_mod" use:enhance>
							<fieldset>
								<legend>Update mod info</legend>
						
								<div>
									<input type="checkbox" checked={data.mod.featured} name="featured" id="update-mod-featured" />
									<label for="update-mod-featured">Featured</label>
								</div>
						
								<input type="submit" value="Update" />
							</fieldset>
						</form>
						<form method="POST" action="?/update_mod_version" use:enhance>
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
						<form method="POST" action="?/create_version" use:enhance>
							<fieldset>
								<legend>Create new version</legend>

								<label for="create-mod-download">Download link:</label>
								<input type="url" id="create-mod-download" name="download_link" />

								<input type="submit" value="Create" />
							</fieldset>
						</form>
					{/if}
				</TabPage>
			{/if}
		</Tabs>
	</section>
	<aside>
		<section>
			<Column align="left" gap="small">
				<span class="card-info"><Icon icon="version"/>{data.version.version}</span>
				<span class="card-info"><Icon icon="download"/>{data.mod.download_count}</span>
				<span class="card-info"><Icon icon="time"/>{serverTimestampToAgoString(data.mod.created_at)}</span>
				<span class="card-info"><Icon icon="update"/>{serverTimestampToAgoString(data.mod.updated_at)}</span>
				<span class="card-info"><Icon icon="geode"/>{data.version.geode}</span>
				<span class="card-info"><VersionCards gd={data.version.gd} /></span>
			</Column>
		</section>
		<section>
			<Column align="stretch" gap="small">
				<Button href={data.version.download_link} icon="download" style="primary-filled">Download</Button>
				{#if data.mod.repository}
					<Button href={data.mod.repository} icon="github">Source Code</Button>
				{/if}
			</Column>
		</section>
		<section>
			<Column align="left" gap="small">
				<p>ID: <code>{data.mod.id}</code></p>
			</Column>
		</section>
	</aside>
</Row>

<style lang="scss">
	header {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		gap: 1rem;
		font-size: 1.3rem;
		
		h1 {
			font-family: var(--font-heading);
			font-size: 1.5em;
			margin: 0;
		}
	}
	section {
		background-color: var(--background-950);
		padding: .75rem;
		// gap: .5rem;
		border-radius: .5rem;
	}
	aside {
		display: flex;
		flex-direction: column;
		gap: var(--gap-small);
	}
	.card-info {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: .5em;
		
		& > :global(.icon) {
			--icon-size: 1.2em;
			color: var(--secondary-300);
			transition-duration: var(--transition-duration);
		}
	}
	article.version {
		display: flex;
		flex-direction: column;
		align-items: stretch;
		gap: .5rem;

		padding: .75rem;
		border-radius: .5rem;
		background-color: color-mix(in srgb, var(--background-500) 25%, transparent);

		h2 {
			margin: 0;
			font-family: var(--font-heading);
			color: var(--accent-300);
		}
	}
</style>
