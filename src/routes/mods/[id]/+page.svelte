<script lang="ts">
    import { goto } from "$app/navigation";
    import { page } from "$app/stores";
    import { enhance } from '$app/forms';

    import SvelteMarkdown from "svelte-markdown";
    import type { PageData, ActionData } from "./$types.js";
    import { IndexClient } from "$lib/api/index-repository.js";
    import Row from "$lib/components/Row.svelte";
    import Column from "$lib/components/Column.svelte";
    import Button from "$lib/components/Button.svelte";
    import Tabs from "$lib/components/Tabs.svelte";
    import TabPage from "$lib/components/TabPage.svelte";
    import Link from "$lib/components/Link.svelte";
    import Icon from "$lib/components/Icon.svelte";
    import Gap from "$lib/components/Gap.svelte";
    import { serverTimestampToAgoString, serverTimestampToDateString, formatNumber, iconForTag } from "$lib";
    import Waves from "$lib/components/Waves.svelte";
    import Label from "$lib/components/Label.svelte";
    import InfoBox from "$lib/components/InfoBox.svelte";
    import iconPlaceholder from "$lib/assets/icon-placeholder.png";
    import VersionCards from "$lib/components/VersionCards.svelte";
    import Empty from "$lib/components/Empty.svelte";
    import Pagination from "$lib/components/Pagination.svelte";
    import LoadingOverlay from "$lib/components/LoadingOverlay.svelte";
    import VersionCard from "$lib/components/VersionCard.svelte";
    import Select from "$lib/components/Select.svelte";
    import SelectOption from "$lib/components/SelectOption.svelte";
    import type { ModStatus } from "$lib/api/models/mod-version.js";
    import GeodeMarkdown from "$lib/components/GeodeMarkdown.svelte";

    export let data: PageData;

    $: url_params = $page.url.searchParams;

    $: status = data.version_params.status ?? "accepted";
    $: invalid_status = !verifyStatus(status);

    const verifyStatus = (status: string): status is ModStatus => {
        return status == "accepted" || status == "rejected" || status == "pending";
    }

    $: per_page = data.version_params.per_page ?? 10;
    $: current_page = data.version_params.page ?? 1;
    let searching = false;

    const logoUrl = IndexClient.getModLogo(data.mod.id).toString();

    const developer_ids = data.mod.developers.map(d => d.id);
    const can_update_mod = data.user && developer_ids.includes(data.user.id) || false;
    const can_modify_mod = data.user?.admin || false;
    const owns_mod = can_update_mod && data.mod.developers.some(d => d.is_owner && d.id == data.user?.id);

    const paid = data.mod.tags.includes("paid");

    const mod_source = data.mod.repository ?? data.mod.links?.source;
    const multiple_links = mod_source
        ? (!!data.mod.links?.homepage || !!data.mod.links?.community)
        : (!!data.mod.links?.homepage && !!data.mod.links?.community);

    const updateSearch = async () => {
        searching = true;

        const params = new URLSearchParams();

        const current_version = url_params.get("version");
        if (current_version) {
            params.set("version", current_version);
        }

        params.set("status", status);

        await goto(`/mods/${data.mod.id}?${params}`, { noScroll: true });
        searching = false;
    }

    const onChangePage = async (next_page: number) => {
        searching = true;

        const params = new URLSearchParams(url_params);
        params.set("page", next_page.toString());

        await goto(`/mods/${data.mod.id}?${params}`, { noScroll: true });
        searching = false;
    }

    export let form: ActionData;
</script>

<svelte:head>
    <title>{data.version.name}</title>
    <meta property="og:title" content={data.version.name} />
    <meta name="description" content={data.version.description} />
    <meta name="og:description" content={data.version.description} />
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
        <div class="title-container">
            {#if data.mod.featured}
                <Label style="accent-transparent" icon="featured" />
            {/if}
            <h1>
                {data.version.name}
            </h1>
        </div>
        <p>
            {#each data.mod.developers as dev, index}
                {index > 0 ? ', ' : ''}<Link href={`/mods?developer=${dev.username}`} --link-color="var(--accent-300)">{dev.display_name}</Link>
            {/each}
        </p>
    </Column>
</header>

<Row align="top" wrap="wrap-reverse" gap="small">
    <section>
        <Tabs>
            <TabPage name="Description" id="description" icon="description">
                <div class="markdown">
                    {#if paid}
                        <Column align="center">
                            <InfoBox type="info">
                                This mod contains <em>Paid Content</em>.
                                This means that some or all features of the mod <em>require money to use</em>.
                                <br /> <br />
                                Geode does not handle any payments. The mod handles all transactions in their own way.
                                The paid content may not be available in your country.
                            </InfoBox>
                        </Column>
                    {/if}
                    <GeodeMarkdown source={data.mod.about ?? 'No description provided'} />
                </div>
            </TabPage>
            <TabPage name="Changelog" id="changelog" icon="changelog">
                <div class="markdown">
                    <GeodeMarkdown source={data.mod.changelog ?? 'No changelog provided'} />
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

                    <LoadingOverlay loading={searching}>
                        <Column gap="small" align="stretch">
                            <Pagination
                            label="versions"
                            labelOne="version"
                            perPage={per_page}
                            total={data.versions.count}
                            pageCount={data.versions.data.length}
                            page={current_page}
                            on:select={(e) => onChangePage(e.detail.page)}>
                                {#if can_modify_mod || can_update_mod}
                                    <Select title="Status" titleIcon="status" on:select={ev => {
                                        const new_status = ev.detail.value;
                                        if (status != new_status && verifyStatus(new_status)) {
                                            status = new_status;
                                            updateSearch();
                                        }
                                    }}>
                                        <SelectOption icon="verified" title="Accepted" value="accepted" isDefault={status == "accepted" || invalid_status}/>
                                        <SelectOption icon="time" title="Pending" value="pending" isDefault={status == "pending"}/>
                                        <SelectOption icon="rejected" title="Rejected" value="rejected" isDefault={status == "rejected"}/>
                                    </Select>
                                {/if}
                            </Pagination>
                            {#if data.versions.count != 0}
                                {#each data.versions.data as version}
                                    <VersionCard mod={data.mod} version={version} />
                                {/each}
                            {:else}
                                <p>This mod has no {status} versions.</p>
                            {/if}
                        </Column>
                    </LoadingOverlay>
                </Column>
            </TabPage>
            {#if can_modify_mod || can_update_mod}
                <TabPage name="Modify" id="modify" icon="modify">
                    <Column align="left" gap="small">
                        {#if form?.message}
                            <InfoBox type="error">
                                Failed to perform action: {form.message}
                            </InfoBox>
                        {/if}

                        {#if form?.success}
                            <InfoBox type="info">Action performed!</InfoBox>
                        {/if}
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
                                        <textarea name="info" id="update-version-info" rows=6 cols=40 value={data.version.info ?? null}></textarea>
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
                        {#if owns_mod}
                            <form method="POST" action="?/add_developer" use:enhance>
                                <fieldset>
                                    <legend>Manage developers</legend>

                                    <label for="add-developer-name">Username:</label>
                                    <input type="text" id="add-developer-name" name="developer" />

                                    <div>
                                        <button formaction="?/remove_developer">Remove</button>
                                        <input type="submit" value="Add" />
                                    </div>
                                </fieldset>
                            </form>
                        {/if}
                    </Column>
                </TabPage>
                <TabPage name="Extra" id="extra" icon="examples">
                    <Column align="left">
                        {#if data.version.direct_download_link}
                            {@const download_link = data.version.direct_download_link}
                            <p class="color-link">Direct download: <Link href={download_link}>{new URL(download_link).hostname}</Link></p>
                        {/if}
                        <p>Download hash: <code>{data.version.hash.substring(0, 7)}</code></p>

                        {#if data.version.early_load || data.version.api}
                            <Row align="center" justify="top" gap="small">
                                {#if data.version.early_load}
                                    <Label icon="time" style="accent-alt">Early Load</Label>
                                {/if}
                                {#if data.version.api}
                                    <Label icon="tag-enhancement" style="accent">API</Label>
                                {/if}
                            </Row>
                        {/if}
                    </Column>

                    <h2>Dependencies</h2>
                    {#if data.version.dependencies?.length}
                        <ul class="color-link">
                            {#each data.version.dependencies as dependency}
                                <li>
                                    {dependency.importance} -
                                    <Link href={`/mods/${dependency.mod_id}`}>{dependency.mod_id}</Link>
                                    ({dependency.version})
                                </li>
                            {/each}
                        </ul>
                    {:else}
                        <div>Mod has no dependencies.</div>
                    {/if}

                    <h2>Incompatibilities</h2>
                    {#if data.version.incompatibilities?.length}
                        <ul class="color-link">
                            {#each data.version.incompatibilities as incompatibility}
                                <li>
                                    {incompatibility.importance} -
                                    <Link href={`/mods/${incompatibility.mod_id}`}>{incompatibility.mod_id}</Link>
                                    ({incompatibility.version})
                                </li>
                            {/each}
                        </ul>
                    {:else}
                        <div>Mod has no incompatibilities.</div>
                    {/if}
                </TabPage>
            {/if}
        </Tabs>
    </section>
    <aside>
        <section>
            <Column align="left" gap="small">
                <span class="card-info"><Icon icon="version"/>{data.version.version}</span>
                <span class="card-info"><Icon icon="download"/>{formatNumber(data.mod.download_count)}</span>
                <span class="card-info" title={serverTimestampToDateString(data.mod.created_at)}><Icon icon="time"/>{serverTimestampToAgoString(data.mod.created_at)}</span>
                <span class="card-info" title={serverTimestampToDateString(data.mod.updated_at)}><Icon icon="update"/>{serverTimestampToAgoString(data.mod.updated_at)}</span>
                <span class="card-info"><Icon icon="geode"/>{data.version.geode}</span>
                <span class="card-info"><VersionCards gd={data.version.gd} /></span>

                {#if data.mod.tags.length > 0}
                    <div class="mod-tags">
                        <Row wrap="wrap" gap="tiny" align="center" justify="top">
                            {#each data.mod.tags as tag}
                                <Label icon={iconForTag(tag)} style="secondary">
                                    {tag.charAt(0).toUpperCase() + tag.slice(1)}
                                </Label>
                            {/each}
                        </Row>
                    </div>
                {/if}
            </Column>
        </section>
        <section>
            <Column align="stretch" gap="small">
                <Button href={data.version.download_link} icon="download" style="primary-filled">Download</Button>
                {#if multiple_links}
                    <div class="link-row">
                        <!-- wrapping in divs so i can apply grow to them -->
                        {#if data.mod.links?.homepage}
                            <div>
                                <Button href={data.mod.links.homepage} icon="web" />
                            </div>
                        {/if}
                        {#if mod_source}
                            <div>
                                <Button href={mod_source} icon="github" />
                            </div>
                        {/if}
                        {#if data.mod.links?.community}
                            <div>
                                <Button href={data.mod.links.community} icon="community" />
                            </div>
                        {/if}
                    </div>
                {:else}
                    {#if data.mod.links?.homepage}
                        <Button href={data.mod.links.homepage} icon="web">Homepage</Button>
                    {/if}
                    {#if mod_source}
                        <Button href={mod_source} icon="github">Source Code</Button>
                    {/if}
                    {#if data.mod.links?.community}
                        <Button href={data.mod.links.community} icon="community">Community</Button>
                    {/if}
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

        .title-container {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
        }

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

    .mod-tags {
        /* width chosen by fair dice roll */
        max-width: 18rem;
        padding-top: 0.25rem;
    }

    .color-link {
        --link-color: var(--accent-300);
    }

    .link-row {
        display: flex;
        gap: var(--gap-small);

        & > div {
            flex-grow: 1;
        }
    }
</style>
