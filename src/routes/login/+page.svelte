<script>
    import Button from "$lib/components/Button.svelte";
    import LoadingOverlay from "$lib/components/LoadingOverlay.svelte";

    let githubLoading = $state(false);
</script>

<svelte:head>
    <title>Login | Geode</title>
    <meta name="description" content="Developer Login" />
</svelte:head>

<div class="card">
    <h2>Developer login</h2>
    <LoadingOverlay size="small" loading={githubLoading}>
        <Button icon="github" href="/login/github/start" onclick={() => (githubLoading = true)}>
            Sign in with GitHub
        </Button>
    </LoadingOverlay>
</div>

<style>
    .card {
        margin-top: 2em;

        display: flex;
        flex-direction: column;
        align-items: center;

        gap: 2em;

        padding: 1em;
    }

    h2 {
        margin: 0;
    }
</style>
