<script lang="ts">
    import { enhance } from "$app/forms";
    import type { PageData, ActionData } from "./$types.js";
    import ModCard from "$lib/components/ModCard.svelte";
    import Waves from "$lib/components/Waves.svelte";
    import Gap from "$lib/components/Gap.svelte";
    import DevRoleChip from "$lib/components/DevRoleChip.svelte";
    import Button from "$lib/components/Button.svelte";

    export let data: PageData;
    export let form: ActionData;

    const isAdmin = data.loggedInUser?.admin || false;
</script>

<svelte:head>
    <title>{data.developer.display_name}'s profile | Geode</title>
    <meta name="description" content="{data.developer.display_name}'s developer profile on the Geode index" />
    <meta name="og:image" content="https://avatars.githubusercontent.com/u/{data.developer.github_id}" />
    <meta name="og:image:width" content="100" />
    <meta name="og:image:height" content="100" />
</svelte:head>

<Waves type="top" />
<Gap size="large" />

<main class="flow">
    <header class="card | with-sidebar">
        <div class="sidebar | profile-pic-container">
            <img
                src={`https://avatars.githubusercontent.com/u/${data.developer.github_id}`}
                alt="your profile picture"
                width="225"
                height="225" />
        </div>
        <div class="flow | not-sidebar">
            <h1>{data.developer.display_name}</h1>
            <p class="username">
                {data.developer.username} ({data.developer.id})
            </p>
            <div class="chips">
                {#if data.developer.verified}
                    <DevRoleChip type="verified" />
                {/if}
                {#if data.developer.admin}
                    <DevRoleChip type="admin" />
                {/if}
            </div>
            <div class="profile-buttons">
                <Button href="https://github.com/{data.developer.username}" icon="github">GitHub</Button>
            </div>
        </div>
    </header>
    {#if isAdmin}
        <section class="card flow">
            <h2>Modify user</h2>
            <form method="POST" class="flow" action="?/modify_user" use:enhance>
                <div class="form-control">
                    <input type="checkbox" checked={data.developer.verified} name="verified" id="modify-verified" />
                    <label for="modify-verified">Verified</label>
                </div>

                <div class="form-control">
                    <input type="checkbox" checked={data.developer.admin} name="admin" id="modify-admin" />
                    <label for="modify-admin">Admin</label>
                </div>

                <button type="submit">
                    <Button>Update</Button>
                </button>
            </form>
        </section>
    {/if}
    <section class="card | flow">
        {#if data.error}
            <small>Error loading page: {data.error}</small>
        {/if}

        {#if form?.message}
            <small>Error submitting form: {form.message}</small>
        {/if}

        <h2>Top mods</h2>

        {#if data.mods && data.mods.count > 0}
            <div class="mod-row">
                {#each data.mods.data as mod (mod.id)}
                    {@const version = mod.versions[0]}
                    <ModCard {mod} {version} />
                {/each}
            </div>
        {:else}
            <p>This developer has no mods uploaded</p>
        {/if}

        <Button href="/mods?developer={data.developer.username}">
            See more by {data.developer.display_name}
        </Button>
    </section>
</main>

<style>
    main {
        margin-inline: 1rem;
    }

    h1,
    h2 {
        margin: 0;
    }

    h1 {
        font-size: 2.25rem;
    }

    header {
        display: flex;
        gap: 1rem;
    }

    .username {
        color: var(--accent-300);
    }

    .profile-buttons {
        display: flex;
    }

    .chips {
        display: flex;
        gap: 0.5rem;
    }

    .profile-pic-container {
        display: flex;
        justify-content: center;
    }

    img {
        border-radius: 0.5rem;
    }

    button[type="submit"] {
        padding: 0;
        border: none;
        background-color: transparent;
        font-size: 1rem;
    }

    .form-control {
        --flow-size: 0.15em;
    }

    .mod-row {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-wrap: wrap;
        gap: 0.5rem;
    }
</style>
