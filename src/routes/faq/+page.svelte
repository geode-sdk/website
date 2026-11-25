<script lang="ts">
    import Waves from "$lib/components/Waves.svelte";

    // TODO: FAQs in other languages
    import { getNewGDUpdateWasReleased } from "$lib";
    import QuestionList from "$lib/components/faq/QuestionList.svelte";
    import QuestionNav from "$lib/components/faq/QuestionNav.svelte";
    import allFaqs from "$lib/data/faqs-en.json";

    const newGDUpdate = getNewGDUpdateWasReleased();
    // The update categories are only shown if we're in emergency mode
    const faqs = allFaqs.filter((faq) => {
        switch (faq.id) {
            case "new-gd-update-geode-broken":
                return newGDUpdate?.geodeStatus === "fully-broken";
            case "new-gd-update-geode-released":
                return newGDUpdate?.geodeStatus === "just-updated";
            default:
                return true;
        }
    });
</script>

<svelte:head>
    <title>Frequently Asked Questions</title>
    <meta name="description" content="Frequently Asked Questions (FAQ) about Geode and modding Geometry Dash" />
</svelte:head>

<Waves type="top" />

<div class="px-2">
    <h1 class="font-heading mt-30 mb-15 text-center text-5xl font-bold">Frequently Asked Questions</h1>

    <div class="flex items-start justify-center gap-2">
        <div class="nav-panel hidden md:block">
            <QuestionNav {faqs} />
        </div>
        <div class="w-full">
            <QuestionList {faqs} />
        </div>
    </div>
</div>

<style>
    .nav-panel {
        /* Calculate top and max height to be able to scroll all the way
        to the bottom of the page to reach the bottom of the panel */
        --nav-offset: calc(var(--spacing) * 20); /* 5rem = 80px */
        top: var(--nav-offset);
        max-height: calc(98dvh - var(--nav-offset));
        border-radius: 6px;

        position: sticky;
        overflow-y: auto;

        scrollbar-color: gray transparent;
    }
</style>
