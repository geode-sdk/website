<script lang="ts">
    import Waves from "$lib/components/Waves.svelte";

    // TODO: FAQs in other languages
    import allFaqs from "$lib/data/faqs-en.json";
    import { getNewGDUpdateWasReleased } from "$lib";
    import QuestionNav from "$lib/components/faq/QuestionNav.svelte";
    import QuestionList from "$lib/components/faq/QuestionList.svelte";

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

<h1 class="font-heading mt-30 text-5xl font-bold">Frequently Asked Questions</h1>

<div class="flex items-start justify-center gap-2">
    <div class="sticky top-20 max-h-screen scroll-auto">
        <QuestionNav {faqs} />
    </div>
    <div class="w-full">
        <QuestionList {faqs} />
    </div>
</div>
