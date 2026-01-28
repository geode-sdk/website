<script lang="ts">
    import Column from "$lib/components/Column.svelte";
    import Gap from "$lib/components/Gap.svelte";
    import Link from "$lib/components/Link.svelte";
    import Waves from "$lib/components/Waves.svelte";
    import Markdown from "svelte-exmarkdown";

    import { getNewGDUpdateWasReleased } from "$lib";
    import { Localized, useLocalize } from "@nubolab-ffwd/svelte-fluent";

    const newGDUpdate = getNewGDUpdateWasReleased();

    // How to add new FAQs:
    // Step 1. Add a translation in en.ftl 
    //         (remember to start the ID with `faq-q-`!)
    // Step 2. Add it in the massive array below where it belongs
    // If you want to add a category, make sure the ID starts with `faq-category-`

    const faqs: {
        category: string,
        questions: (string | [string, any])[],
    }[] = [
        // The update categories are only shown if we're in emergency mode
        newGDUpdate?.geodeStatus === "fully-broken" ? {
            category: "emergency-update-broken",
            questions: [
                ["why-is-geode-not-working", { new_gd_version: newGDUpdate.newGDVersion }] as [string, any],
                "when-will-geode-update",
                "why-does-this-happen",
                "why-is-it-taking-so-long",
                "will-i-have-to-reinstall-mods",
                "where-can-i-find-news",
            ]
        } : undefined,
        newGDUpdate?.geodeStatus === "just-updated" ? {
            category: "emergency-update-fixed",
            questions: [
                "does-geode-work-now",
                "when-will-mods-be-updated",
                "why-did-geode-break",
            ]
        } : undefined,
        {
            category: "about-geode",
            questions: [
                "is-geode-official",
                "who-made-geode",
                "is-geode-free",
            ]
        },
        {
            category: "common-issues",
            questions: [
                "i-cant-see-geode-button",
                "how-do-i-install-geode-on-linux",
            ]
        },
        {
            category: "using-geode",
            questions: [
                "how-do-i-install-mods",
                "why-cant-i-find-mods",
                "how-do-i-update-mods",
                "how-do-i-uninstall-mods",
                "how-do-i-change-mod-settings",
            ]
        },
        {
            category: "safe-mode",
            questions: [
                "what-is-safe-mode",
                "how-do-i-enable-safe-mode-win-mac",
                "how-do-i-enable-safe-mode-android",
            ]
        },
        {
            category: "advanced",
            questions: [
                "how-do-i-manually-install-mods",
            ]
        },
    ].filter(f => !!f);
    
    const localize = useLocalize();
</script>

<svelte:head>
    <title>{localize("faq-meta-title")}</title>
    <meta name="description" content={localize("faq-meta-desc")} />
</svelte:head>

<Waves type="top" />

<h1><Localized id="faq-title"/></h1>

<div class="main-flow">
    <nav>
        <span>
            {#each faqs as { category, questions }}
                <h2><Localized id={`faq-category-${category}`}/></h2>
                {#each questions as question}
                    {@const id = typeof question === "string" ? question : question[0]}
                    <Link href={"#" + id}><Localized id={`faq-q-${id}.question`}/></Link>
                {/each}
            {/each}
        </span>
    </nav>
    <Column align="stretch">
        {#each faqs as { category, questions }, i}
            {#if i > 0}
                <Gap size="normal" />
            {/if}
            <h2><Localized id={`faq-category-${category}`}/></h2>
            {#each questions as question}
                {@const id = typeof question === "string" ? question : question[0]}
                <article
                    {id}
                    class={[
                        "faq", "scrolled", (
                            category === "emergency-update-broken" ||
                            category === "emergency-update-fixed"
                        ) ? "alert" : null
                    ]}
                >
                    <h3><Localized id={`faq-q-${id}.question`}/></h3>
                    <div class="markdown"><Markdown md={localize(
                        `faq-q-${id}.answer`, typeof question === "string" ? undefined : question[1]
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
        font-size: var(--font-size-title);
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
