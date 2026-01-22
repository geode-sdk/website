<script lang="ts">
    import { goto } from "$app/navigation";
    import { page } from "$app/state";
    import { enhance } from "$app/forms";

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
    import VersionCards from "$lib/components/VersionCards.svelte";
    import Pagination from "$lib/components/Pagination.svelte";
    import LoadingOverlay from "$lib/components/LoadingOverlay.svelte";
    import VersionCard from "$lib/components/VersionCard.svelte";
    import Select from "$lib/components/Select.svelte";
    import SelectOption from "$lib/components/SelectOption.svelte";
    import type { ModStatus } from "$lib/api/models/mod-version.js";
    import GeodeMarkdown from "$lib/components/GeodeMarkdown.svelte";
    import ModLogo from "$lib/components/ModLogo.svelte";
    import ModDevelopersList from "$lib/components/ModDevelopersList.svelte";

    interface Props {
        data: PageData;
        form: ActionData;
    }

    let { data, form }: Props = $props();

    const verifyStatus = (status: string): status is ModStatus => {
        return status == "accepted" || status == "rejected" || status == "pending";
    };

    let searching = $state(false);

    const user = $derived(data.loggedInUser);

    const developer_ids = $derived(data.mod.developers.map((d) => d.id));
    const can_update_mod = $derived((user && developer_ids.includes(user.id)) || false);
    const is_admin = $derived(user?.admin === true);
    const owns_mod = $derived(can_update_mod && data.mod.developers.some((d) => d.is_owner && d.id == user?.id));

    const paid = $derived(data.mod.tags.includes("paid"));

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
    };

    const onChangePage = async (next_page: number) => {
        searching = true;

        const params = new URLSearchParams(url_params);
        params.set("page", next_page.toString());

        await goto(`/mods/${data.mod.id}?${params}`, { noScroll: true });
        searching = false;
    };

    const getTagDisplay = (tag: string) => {
        const foundTag = data.tags.find((x) => x.name == tag);
        return foundTag ? foundTag.display_name : tag.charAt(0).toUpperCase() + tag.slice(1);
    };

    let url_params = $derived(page.url.searchParams);
    let status = $derived(data.version_params.status ?? "accepted");
    let invalid_status = $derived(!verifyStatus(status));
    let per_page = $derived(data.version_params.per_page ?? 10);
    let current_page = $derived(data.version_params.page ?? 1);
    let logoUrl = $derived(
        IndexClient.getModLogo(data.mod.id, {
            version: data.version.version,
            status: data.version.status != "accepted" ? data.version.status : undefined,
        }).toString(),
    );
    let mod_source = $derived(data.mod.repository ?? data.mod.links?.source);
    let multiple_links = $derived(
        mod_source
            ? !!data.mod.links?.homepage || !!data.mod.links?.community
            : !!data.mod.links?.homepage && !!data.mod.links?.community,
    );
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
    <ModLogo mod={data.mod} version={data.version} size="large" />

    <Column align="start" gap="tiny">
        <div class="title-container">
            {#if data.mod.featured}
                <Label design="accent-transparent" icon="featured" />
            {/if}
            <h1>
                {data.version.name}
            </h1>
        </div>
        <p>
            <ModDevelopersList developers={data.mod.developers} full={true} />
        </p>
    </Column>
</header>

<div class="wrapper">
    <Row align="start" wrap="wrap-reverse" gap="small">
        <section>
            <Tabs>
                <TabPage name="Description" id="description" icon="description">
                    <div class="markdown">
                        {#if paid}
                            <Column align="center">
                                <InfoBox type="info">
                                    This mod contains <em>Paid Content</em>
                                    . This means that some or all features of the mod
                                    <em>require money to use</em>
                                    .
                                    <br />
                                    <br />
                                    Geode does not handle any payments. The mod handles all transactions in their own way.
                                    The paid content may not be available in your country.
                                </InfoBox>
                            </Column>
                        {/if}
                        <GeodeMarkdown source={data.mod.about ?? "No description provided"} />
                    </div>
                </TabPage>
                <TabPage name="Changelog" id="changelog" icon="changelog">
                    <div class="markdown">
                        <GeodeMarkdown source={data.mod.changelog ?? "No changelog provided"} />
                    </div>
                </TabPage>
                <TabPage name="Versions" id="versions" icon="version">
                    <Column gap="small" align="stretch">
                        <Column align="center">
                            <InfoBox type="warning">
                                The recommended way to install mods is through the <em>in-game mod loader</em>
                                . You will have to
                                <em>manually install</em>
                                the
                                <code>.geode</code>
                                files you get from this page.
                                <br />
                                <br />
                                Some mods also require other mods as
                                <em>dependencies</em>
                                ; you will need to find and install them yourself.
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
                                    select={(page) => onChangePage(page)}>
                                    {#if is_admin || can_update_mod}
                                        <Select
                                            title="Status"
                                            titleIcon="status"
                                            select={(value) => {
                                                const new_status = value;
                                                if (status !== new_status && verifyStatus(new_status)) {
                                                    status = new_status;
                                                    updateSearch();
                                                }
                                            }}>
                                            <SelectOption
                                                icon="verified"
                                                title="Accepted"
                                                value="accepted"
                                                isDefault={status === "accepted" || invalid_status} />
                                            <SelectOption
                                                icon="time"
                                                title="Pending"
                                                value="pending"
                                                isDefault={status === "pending"} />
                                            <SelectOption
                                                icon="rejected"
                                                title="Rejected"
                                                value="rejected"
                                                isDefault={status === "rejected"} />
                                        </Select>
                                    {/if}
                                </Pagination>
                                {#if data.versions.count !== 0}
                                    {#each data.versions.data as version}
                                        <VersionCard mod={data.mod} {version} />
                                    {/each}
                                {:else}
                                    <p>This mod has no {status} versions.</p>
                                {/if}
                            </Column>
                        </LoadingOverlay>
                    </Column>
                </TabPage>
                {#if can_update_mod}
                    <TabPage name="Modify" id="modify" icon="modify">
                        <Column align="start" gap="small">
                            {#if form?.message}
                                <InfoBox type="error">
                                    Failed to perform action: {form.message}
                                </InfoBox>
                            {/if}

                            {#if form?.success}
                                <InfoBox type="info">Action performed!</InfoBox>
                            {/if}

                            <form method="POST" class="flow" action="?/create_version" use:enhance>
                                <h2>Submit an update</h2>
                                <div class="form-control">
                                    <label for="create-mod-download">Download link:</label>
                                    <input type="url" required id="create-mod-download" name="download_link" />
                                </div>

                                <button type="submit">
                                    <Button design="secondary-filled">Submit</Button>
                                </button>
                            </form>
                            {#if owns_mod}
                                <form method="POST" class="flow" action="?/add_developer" use:enhance>
                                    <h2>Manage developers</h2>
                                    <div class="form-control">
                                        <label for="add-developer-name">Username:</label>
                                        <input type="text" required id="add-developer-name" name="developer" />
                                    </div>

                                    <div>
                                        <button type="submit">
                                            <Button design="secondary-filled">Add</Button>
                                        </button>
                                        <button type="submit" formaction="?/remove_developer">
                                            <Button design="primary-filled">Remove</Button>
                                        </button>
                                    </div>
                                </form>
                            {/if}
                        </Column>
                    </TabPage>
                {/if}
                {#if is_admin}
                    <TabPage name="Admin" id="admin" icon="admin">
                        <Column align="start">
                            {#if form?.message}
                                <InfoBox type="error">
                                    Failed to perform action: {form.message}
                                </InfoBox>
                            {/if}

                            {#if form?.success}
                                <InfoBox type="info">Action performed!</InfoBox>
                            {/if}
                            <form method="POST" action="?/update_mod" use:enhance>
                                <fieldset>
                                    <legend>Update mod info</legend>

                                    <div>
                                        <input
                                            type="checkbox"
                                            checked={data.mod.featured}
                                            name="featured"
                                            id="update-mod-featured" />
                                        <label for="update-mod-featured">Featured</label>
                                    </div>

                                    <input type="submit" value="Update" />
                                </fieldset>
                            </form>
                            <form method="POST" action="?/update_mod_version" use:enhance>
                                <fieldset>
                                    <legend>
                                        Update version {data.version.version} status
                                    </legend>

                                    <div>
                                        <label for="update-version-status">Status:</label>
                                        <select name="status" id="update-version-status">
                                            <option selected={data.version.status === "accepted"} value="accepted">
                                                Accepted
                                            </option>
                                            <option selected={data.version.status === "pending"} value="pending">
                                                Pending
                                            </option>
                                            <option selected={data.version.status === "rejected"} value="rejected">
                                                Rejected
                                            </option>
                                            <option selected={data.version.status === "unlisted"} value="unlisted">
                                                Unlisted
                                            </option>
                                        </select>
                                    </div>

                                    <div>
                                        <label for="update-version-info">Reason:</label>
                                        <br />
                                        <!-- prettier-ignore -->
                                        <textarea
                                            name="info"
                                            id="update-version-info"
                                            rows="6"
                                            cols="40"
                                            value={data.version.info ?? ""}></textarea>
                                    </div>

                                    <input type="hidden" name="mod_version" value={data.version.version} />

                                    <input type="submit" value="Update" />
                                </fieldset>
                            </form>
                            {#if data.version.direct_download_link}
                                {@const download_link = data.version.direct_download_link}
                                <p class="color-link">
                                    Direct download: <Link href={download_link}>
                                        {new URL(download_link).hostname}
                                    </Link>
                                </p>
                                {@const match = /^(https?:\/\/github\.com\/[\w-]+\/[\w-]+).+/.exec(
                                    data.version.direct_download_link,
                                )}
                                {#if match}
                                    <p class="color-link">
                                        GitHub source: <Link href={match[1]} newTab={true}>
                                            {match[1]}
                                        </Link>
                                    </p>
                                {/if}
                            {/if}
                            <p>
                                Download hash: <code>
                                    {data.version.hash.substring(0, 7)}
                                </code>
                            </p>

                            {#if data.version.early_load || data.version.api || data.version.gd.ios}
                                <Row align="center" justify="top" gap="small">
                                    {#if data.version.early_load}
                                        <Label icon="time" design="accent-alt">Early Load</Label>
                                    {/if}
                                    {#if data.version.api}
                                        <Label icon="tag-enhancement" design="accent">API</Label>
                                    {/if}
                                    {#if data.version.gd.ios}
                                        <Label icon="ios" design="gray">{data.version.gd.ios}</Label>
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
                                        <Link href={`/mods/${dependency.mod_id}`}>
                                            {dependency.mod_id}
                                        </Link>
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
                                        <Link href={`/mods/${incompatibility.mod_id}`}>
                                            {incompatibility.mod_id}
                                        </Link>
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
                <Column align="start" gap="small">
                    <span class="card-info">
                        <Icon icon="version" />{data.version.version}
                    </span>
                    <span class="card-info">
                        <Icon icon="download" />{formatNumber(data.mod.download_count)}
                    </span>
                    <span class="card-info" title={serverTimestampToDateString(data.mod.created_at)}>
                        <Icon icon="time" />{serverTimestampToAgoString(data.mod.created_at)}
                    </span>
                    <span class="card-info" title={serverTimestampToDateString(data.mod.updated_at)}>
                        <Icon icon="update" />{serverTimestampToAgoString(data.mod.updated_at)}
                    </span>
                    <span class="card-info">
                        <Icon icon="geode" />{data.version.geode}
                    </span>
                    {#if data.version}
                        <span class="card-info">
                            <VersionCards gd={data.version.gd} />
                        </span>
                    {/if}

                    {#if data.mod.tags.length > 0}
                        <div class="mod-tags">
                            <Row wrap="wrap" gap="tiny" align="center" justify="top">
                                {#each data.mod.tags as tag}
                                    <Label icon={iconForTag(tag)} design="secondary">
                                        {getTagDisplay(tag)}
                                    </Label>
                                {/each}
                            </Row>
                        </div>
                    {/if}
                </Column>
            </section>
            <section>
                <Column align="stretch" gap="small">
                    <Button href={data.version.download_link} icon="download" design="primary-filled">Download</Button>
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
                <Column align="start" gap="small">
                    <p>
                        ID: <code>{data.mod.id}</code>
                    </p>
                </Column>
            </section>
            <section>
                {#if data.version.dependencies?.length}
                    <p>Dependencies:</p>
                    <ul>
                        {#each data.version.dependencies as dependency}
                            <div class="color-link">
                                <li>
                                    <Link href={`/mods/${dependency.mod_id}`}>
                                        {dependency.mod_id}
                                    </Link>
                                    ({dependency.version}) ({dependency.importance})
                                </li>
                            </div>
                        {/each}
                    </ul>
                {:else}
                    <div>Mod has no dependencies.</div>
                {/if}
            </section>
        </aside>
    </Row>
</div>

<style lang="scss">
    h2 {
        margin: 0;
    }
    header {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        gap: 1rem;
        font-size: 1.3rem;
        padding: 1rem;

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
        padding: 0.75rem;
        // gap: .5rem;
        border-radius: 0.5rem;
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
        gap: 0.5em;

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

    input {
        padding: 0.5rem;
        border: 1px solid var(--secondary-200);
        border-radius: 0.2rem;
        font-size: 1rem;
    }

    button[type="submit"] {
        padding: 0;
        border: none;
        background-color: transparent;
        font-size: 1rem;
    }

    label {
        font-size: 0.9rem;
    }

    .wrapper {
        padding: 1rem;
    }
</style>
