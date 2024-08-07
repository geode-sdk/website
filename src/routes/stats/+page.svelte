<script lang="ts">
    import Column from "$lib/components/Column.svelte";
    import Gap from "$lib/components/Gap.svelte";
    import InfoBox from "$lib/components/InfoBox.svelte";
    import Row from "$lib/components/Row.svelte";
    import Waves from "$lib/components/Waves.svelte";
    import MoneyBox from "$lib/components/MoneyBox.svelte";
    import { getServerStats } from "$lib/api/index-repository";
    import LoadingCircle from "$lib/components/LoadingCircle.svelte";
    import { onMount } from "svelte";

    let stats: { total_geode_downloads: number; total_mod_count: number, total_mod_downloads: number, total_registered_developers: number };
    let error: any;
    let loading = true;

    async function fetchStats() {
        console.log("called")
        try {
            stats = await getServerStats();
            error = null;
        } catch (e) {
            error = e;
        } finally {
            loading = false;
        }
    }


    onMount(() => {
        fetchStats();
        const interval = setInterval(fetchStats, 5000); // 30000 ms = 30 seconds

        return () => clearInterval(interval);
    });
</script>

<Waves type="top" />
<Gap size="large" />

<svelte:head>
    <title>Live Stats</title>
    <meta name="description" content="View live stats about the Geode mod loader!">
</svelte:head>

<h1>Live Stats</h1>

<Column>
{#if loading}
    <LoadingCircle size="small"/><p>Loading stats...</p>
{:else if error}
    <InfoBox type="error">Unable to load stats!</InfoBox>
{:else}
    <Row>
        <MoneyBox num={stats.total_geode_downloads} icon="geode" text="downloads" />
        <MoneyBox num={stats.total_mod_count} icon="graph" text="mods published" />
    </Row>
    <Row>
        <MoneyBox num={stats.total_mod_downloads} icon="download" text="mod downloads" />
        <MoneyBox num={stats.total_registered_developers} icon="tag-developer" text="developers" />
    </Row>
{/if}
</Column>


<Gap size="normal" />

<style lang="scss">
	@use '$lib/styles/media-queries.scss' as *;

    .img-with-width {
        max-width: 35vw;
        flex-shrink: 0;

		@include lt-lg {
            max-width: 65vw;
        }
    }
    section {
        background-color: var(--background-950);
        padding: 1rem;
        border-radius: .5rem;
    }
    h1 {
        margin: 0;
        font-family: var(--font-heading);
        font-weight: 600;
        color: var(--text-50);
        font-size: min(var(--font-size-title), 15vw);
    }
    h2 {
        margin: 0;
        font-family: var(--font-heading);
        font-weight: 600;
        color: var(--text-50);
        font-size: var(--font-size-heading);
    }
    em {
        font-weight: unset;
    }
</style>
