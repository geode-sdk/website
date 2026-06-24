<script lang="ts">
    import Waves from "$lib/components/Waves.svelte";
    import GeodeMarkdown from "$lib/components/GeodeMarkdown.svelte";
    import ppolicy from "../../../privacy-policy.md?raw";
</script>

<svelte:head>
    <title>Privacy Policy</title>
    <meta name="description" content="Privacy policy covering data collected through Geode and its website" />
</svelte:head>

<Waves type="top" />

<div class="px-2">
    <h1 class="font-heading mt-30 mb-15 text-5xl font-bold text-center">Privacy Policy</h1>
    <div class="markdown mx-auto">
        <GeodeMarkdown source={ppolicy} />
    </div>
</div>
