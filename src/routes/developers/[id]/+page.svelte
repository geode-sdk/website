<script lang="ts">
    import { enhance } from '$app/forms';
    import type { PageData, ActionData } from "./$types.js";
    import ModCard from '$lib/components/ModCard.svelte';
    import Column from '$lib/components/Column.svelte';
    import Link from '$lib/components/Link.svelte';

    export let data: PageData;
    export let form: ActionData;

    const can_update_user = data.user && data.user.id == data.developer.id || false;
    const can_modify_user = data.user?.admin || false;
</script>

{data.developer.display_name} ({data.developer.id})

<a href={`https://github.com/${data.developer.username}`}>github</a>

{#if can_update_user}
<a href="/me">User Settings</a>
{/if}

{#if can_modify_user}
<form method="POST" action="?/modify_user" use:enhance>
    <fieldset>
        <legend>Modify user</legend>

        <div>
            <input type="checkbox" checked={data.developer.verified} name="verified" id="modify-verified" />
            <label for="modify-verified">Verified</label>
        </div>

        <div>
            <input type="checkbox" checked={data.developer.admin} name="admin" id="modify-admin" />
            <label for="modify-admin">Admin</label>
        </div>

        <input type="submit" value="Update" />
    </fieldset>
</form>
{/if}

<div>
    {#if data.error}
    <small>Error loading page: {data.error}</small>
    {/if}

    {#if form?.message}
        <small>Error submitting form: {form.message}</small>
    {/if}

    {#if data.self_mods}
    <div>
        <h2>Your mods</h2>

        <form>
            <label for="status">Mod Status:</label>
            <select name="status" id="status" bind:value={data.params.status}>
                <option value="accepted">Accepted</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
                <option value="unlisted">Unlisted</option>
            </select>

            <input type="submit" value="Set filter" />

        </form>

        <form method="POST" action="?/upload_mod" use:enhance>
            <fieldset>
                <legend>Create new mod</legend>

                <label for="create-mod-download">Download link:</label>
                <input type="url" id="create-mod-download" name="download_link" />

                <input type="submit" value="Create" />
            </fieldset>
        </form>

        <Column>
            {#each data.self_mods as mod (mod.id)}
                {#each mod.versions as version}
                    <div>
                        <Link --link-color="var(--accent-300)" href={`/mods/${mod.id}?version=${version.version}`}>{version.name} v{version.version}</Link>
                        - {version.status}

                        <p>
                            {#if version.info}
                                {version.info}
                            {:else}
                                <i>No info provided.</i>
                            {/if}
                        </p>
                    </div>
                {/each}
            {/each}
        </Column>
    </div>
    {:else if data.mods}
    <div>
        <div>
            <h2>Top mods</h2>
        </div>

        <div class="mod-row">
            {#each data.mods.data as mod (mod.id)}
            {@const version = mod.versions[0]}
            <ModCard mod={mod} version={version} />
            {/each}
        </div>

        <a href={`/mods?developer=${data.developer.username}`} class="more">More</a>
    </div>
    {/if}
</div>

<style>
.mod-row {
    display: flex;
    flex: 1;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 1em;
}
</style>