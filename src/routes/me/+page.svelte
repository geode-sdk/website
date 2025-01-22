<script lang="ts">
    import type { ActionData, PageData } from "./$types.js";
    import { enhance } from "$app/forms";
    import Button from "$lib/components/Button.svelte";
    import MyPendingModCard from "$lib/components/MyPendingModCard.svelte";
    import InfoBox from "$lib/components/InfoBox.svelte";

    $: updatingSelf = false;
    $: submittingMod = false;

    export let data: PageData;
    export let form: ActionData;

    let self = data.self;
    const myPendingMods = data.myPendingMods.filter(
        (mod) => mod.versions.length > 0,
    );
    const myRejectedMods = data.myRejectedMods.filter(
        (mod) => mod.versions.length > 0,
    );
</script>

<svelte:head>
    <title>Your profile | Geode</title>
    <meta name="description" content="See your own profile on Geode" />
</svelte:head>

<main>
    <h1>Your profile</h1>

    <div class="container | with-sidebar">
        <aside class="card | sidebar">
            <img
                src={`https://avatars.githubusercontent.com/u/${self.github_id}`}
                alt="your profile picture"
                width="225"
                height="225" />
            <form
                method="POST"
                action="?/update_self"
                use:enhance={() => {
                    return async ({ update }) => {
                        form = null;
                        updatingSelf = true;
                        await update({ reset: false });
                        updatingSelf = false;
                    };
                }}>
                <div class="form-control">
                    <label for="display_name">Display name:</label>
                    <input
                        required
                        minlength="2"
                        type="text"
                        value={self.display_name}
                        name="display_name"
                        id="display_name" />
                </div>
                <div class="form-button">
                    <button type="submit" disabled={updatingSelf}>
                        <Button disabled={updatingSelf}>Update</Button>
                    </button>
                </div>
            </form>
        </aside>
        <section class="actions | card flow | not-sidebar">
            {#if form?.success}
                <InfoBox type="info">Action performed!</InfoBox>
            {:else if form}
                <InfoBox type="error">{form?.message}</InfoBox>
            {/if}
            <h2>Logout</h2>
            <form method="POST" class="flow">
                <button formaction="?/logout" type="submit">
                    <Button design="primary-filled">Logout</Button>
                </button>
                <button formaction="?/logout_all" type="submit">
                    <Button design="primary-filled">
                        Logout all devices
                    </Button>
                </button>
            </form>
            <h2>Submit a new mod</h2>
            <form
                method="POST"
                action="?/upload_mod"
                class="flow"
                use:enhance={() => {
                    return async ({ update }) => {
                        form = null;
                        submittingMod = true;
                        await update();
                        submittingMod = false;
                    };
                }}>
                <div class="form-control">
                    <label for="download_link">Download URL:</label>
                    <input
                        type="text"
                        id="download_link"
                        name="download_link"
                        required />
                </div>
                <button type="submit" disabled={submittingMod}>
                    <Button disabled={submittingMod}>Upload</Button>
                </button>
            </form>
            <h2>Your pending mods</h2>
            <ul class="unstyle-list">
                {#each myPendingMods as mod}
                    <li><MyPendingModCard {mod} /></li>
                {:else}
                    <p>You have no pending mods</p>
                {/each}
            </ul>
            <h2>Your rejected mods</h2>
            <ul class="unstyle-list">
                {#each myRejectedMods as mod}
                    <li><MyPendingModCard {mod} /></li>
                {:else}
                    <p>You have no pending mods</p>
                {/each}
            </ul>
        </section>
    </div>
</main>

<style lang="scss">
    h1 {
        margin-bottom: 1rem;
        text-align: center;
        font-family: var(--font-heading);
        font-weight: 600;
        color: var(--text-50);
        font-size: var(--font-size-long-title);
    }

    h2 {
        --flow-size: 0.7em;
        margin: 0;
    }

    main {
        margin-inline: 1rem;
    }

    label {
        font-size: 0.9rem;
    }

    input {
        padding: 0.5rem;
        border: 1px solid var(--secondary-200);
        border-radius: 0.2rem;
        font-size: 1rem;
    }

    aside {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        align-items: center;
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

    .form-button {
        margin-top: 1rem;
        display: flex;
        gap: 0.5rem;
        flex-direction: row-reverse;
    }
</style>
