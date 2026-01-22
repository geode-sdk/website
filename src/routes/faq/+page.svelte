<script lang="ts">
    import Column from "$lib/components/Column.svelte";
    import Gap from "$lib/components/Gap.svelte";
    import Link from "$lib/components/Link.svelte";
    import Waves from "$lib/components/Waves.svelte";
    import Markdown from "svelte-exmarkdown";

    // TODO: FAQs in other languages
    import allFaqs from "$lib/data/faqs-en.json";
    import { getNewGDUpdateWasReleased } from "$lib";
    
    const newGDUpdate = getNewGDUpdateWasReleased();
    // The update categories are only shown if we're in emergency mode
    const faqs = allFaqs.filter(faq => {
        switch (faq.id) {
            case "new-gd-update-geode-broken": return newGDUpdate?.geodeStatus === "fully-broken";
            case "new-gd-update-geode-released": return newGDUpdate?.geodeStatus === "just-updated";
            default: return true;
        }
    });
</script>

<svelte:head>
    <title>Frequently Asked Questions</title>
    <meta name="description" content="Frequently Asked Questions (FAQ) about Geode and modding Geometry Dash" />
</svelte:head>

<Waves type="top" />

<h1>Frequently Asked Questions</h1>

<div class="main-flow">
    <nav>
        <span>
            {#each faqs as { category, questions }}
                <h2>{category}</h2>
                {#each questions as { id, question }}
                    <Link href={"#" + id}>{question}</Link>
                {/each}
            {/each}
        </span>
    </nav>
    <Column align="stretch">
        {#each faqs as { category, questions, id: categoryID }, i}
            {#if i > 0}
                <Gap size="normal" />
            {/if}
            <h2>{category}</h2>
            {#each questions as { id, question, answer }}
                <article
                    {id}
                    class={[
                        "faq", "scrolled", (
                            categoryID === "new-gd-update-geode-broken" ||
                            categoryID === "new-gd-update-geode-released"
                        ) ? "alert" : null
                    ]}
                >
                    <h3>{question}</h3>
                    <div class="markdown"><Markdown md={answer.replace(
                        /{RECENT_GD_UPDATE_VERSION}/g, newGDUpdate?.newGDVersion ?? "(N/A)"
                    )} /></div>
                </article>
            {/each}
        {/each}
    </Column>
</div>

<Gap size="normal" />

<style lang="scss">
    h1 {
        margin: 10rem 0 0;
        font-family: var(--font-heading);
        font-weight: 600;
        color: var(--text-50);
        font-size: var(--font-size-long-title);
    }
    h2 {
        margin: 0;
        font-family: var(--font-heading);
    }
    .main-flow {
        display: flex;
        justify-content: center;
        align-items: flex-start;
        gap: var(--gap-normal);
    }
    nav {
        display: none;
        flex-direction: column;
        gap: var(--gap-small);
        position: sticky;
        top: 5rem;
        max-height: 85vh;
        overflow-y: scroll;

        background-color: color-mix(in srgb, var(--background-950) 50%, transparent);
        border-radius: 0.5rem;
        padding: 0.75rem;

        & > span {
            display: flex;
            flex-direction: column;
            gap: var(--gap-small);

            & > h2 {
                padding: 0;
                margin: 0;
                opacity: 75%;
                font-size: 1em;
                color: var(--background-200);
            }
            & > :global(a) {
                background-color: transparent;
                padding: 0.5rem;
                border-radius: 0.25rem;
                transition: background-color, color;
                transition-duration: var(--transition-duration);
            }
            & > :global(a:hover) {
                background-color: color-mix(in srgb, var(--secondary-500) 25%, transparent);
                color: var(--primary-200);
                text-decoration: none;
            }
        }
    }
    @media screen and (min-width: 650px) {
        nav {
            display: flex;
        }
    }
    article {
        background-color: color-mix(in srgb, var(--background-950) 50%, transparent);
        border-radius: 0.5rem;
        padding: 0.75rem;
        h3 {
            padding: 0;
            margin: 0 0 0.5rem;
            color: var(--accent-300);
        }
        div {
            padding-left: 0.5rem;
            border-left: 0.25rem solid color-mix(in srgb, var(--background-500) 75%, transparent);
        }
        &.alert {
            background-color: color-mix(in srgb, var(--primary-900) 75%, transparent);
        }
        &:global(.highlight-scrolled) {
            background-color: color-mix(in srgb, var(--secondary-500) 25%, transparent);
            h3 {
                color: var(--accent-300);
            }
            div {
                border-left-color: var(--primary-300);
            }
        }
    }
</style>
