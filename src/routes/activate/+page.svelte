<script lang="ts">
    import LoadingCircle from "$lib/components/LoadingCircle.svelte";
    import { onMount } from "svelte";

    onMount(() => {
        const timeout = setTimeout(() => {
            window.location.href = "https://geode-sdk.us.org/mods/capeling.soggy-mod";
        }, 1000);

        return () => {
            clearTimeout(timeout);
        };
    });
</script>

<svelte:head>
    <title>Activation | Sapphire SDK</title>
    <meta name="description" content="Activate Sapphire" />
</svelte:head>

<main>
    <h1>Activate Sapphire</h1>
    <div class="card">
        <LoadingCircle size="normal" />
        <p>Loading activation...</p>
    </div>
</main>

<style>
    .card {
        margin-top: 2em;

        display: flex;
        flex-direction: column;
        align-items: center;

        gap: 2em;

        padding: 1em;
        padding-top: 2em;
    }
</style>