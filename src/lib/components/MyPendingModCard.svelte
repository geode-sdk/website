<script lang="ts">
    import type { ServerSimpleMod } from "$lib/api/models/mod";

    export let mod: ServerSimpleMod;
</script>

<div class="card">
    <div class="split">
        <div>
            <p class="bigger">
                {mod.versions[0].name} v{mod.versions[0].version}
            </p>
            <p class="smaller">{mod.id}</p>
        </div>
        <p>{mod.versions[0].status}</p>
    </div>

    {#if mod.versions[0].status !== "pending"}
        <p class="info">{mod.versions[0].info ?? "No info provided"}</p>
    {/if}
</div>

<style lang="scss">
    .bigger {
        font-size: 1.1rem;
        color: var(--text-50);
    }

    .smaller {
        font-size: 0.8rem;
        color: var(--text-300);
    }

    .split {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .card {
        --card-base-color: var(--background-500);

        background-color: color-mix(
            in srgb,
            var(--card-base-color) 15%,
            transparent
        );
        padding: 0.5rem;
        border-radius: 0.5rem;
    }

    .info {
        border-top: 1px solid var(--background-300);
        padding-top: 0.5rem;
        margin-top: 0.5rem;
    }
</style>
