<script lang="ts">
    import Column from "$lib/components/Column.svelte";
    import Gap from "$lib/components/Gap.svelte";
    import Link from "$lib/components/Link.svelte";
    import Row from "$lib/components/Row.svelte";
    import Waves from "$lib/components/Waves.svelte";
    import { onMount } from "svelte";
    import SvelteMarkdown from "svelte-markdown";

    // TODO: FAQs in other languages
    import faqs from "$lib/data/faqs-en.json";

    function anchorIDForTitle(title: string): string {
        return title
            .replace(/[^\w\s]/g, "")
            .replace(/\s+/g, "-")
            .toLowerCase();
    }

    onMount(() => {
        const faqs = Array.from(document.querySelectorAll('.faq'));
        document.addEventListener('scroll', e => {
            let targetFaq;
            for (const faq of faqs) {
                targetFaq = faq.getAttribute('id');
                const rect = faq.getBoundingClientRect();
                if (document.body.getBoundingClientRect().top > 60) {
                    break;
                }
                if (rect.y + rect.height * 1.5 > window.screen.height / 2) {
                    break;
                }
            }
            if (targetFaq) {
                document.querySelectorAll('.scrolled').forEach(s => s.classList.remove('scrolled'));
                document.querySelector(`a[href="#${targetFaq}"]`)?.classList.add('scrolled');
            }
        });
    });
</script>

<Waves type="top" />
<Gap size="large" />

<h1>Frequently Asked Questions</h1>

<div class="main-flow">
    <nav>
        <span>
            {#each faqs as { category, questions }}
                <h2>{category}</h2>
                {#each questions as { question }}
                    <Link href={"#" + anchorIDForTitle(question)}>{question}</Link>
                {/each}
            {/each}
        </span>
    </nav>
    <Column align="stretch">
        {#each faqs as { category, questions }, i}
            {#if i > 0}
                <Gap size="normal" />
            {/if}
            <h2>{category}</h2>
            {#each questions as { question, answer }}
                <article id={anchorIDForTitle(question)} class="faq scrolled">
                    <h3>{question}</h3>
                    <div class="markdown"><SvelteMarkdown source={answer}/></div>
                </article>
            {/each}
        {/each}
    </Column>
</div>

<Gap size="normal" />

<style lang="scss">
    h1 {
        margin: 0;
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
        display: grid;
        grid-template-columns: 1fr max-content 1fr;
        gap: var(--gap-normal);
    }
    nav {
        display: flex;
        flex-direction: column;
        gap: var(--gap-small);
        position: relative;

        background-color: color-mix(in srgb, var(--background-950) 50%, transparent);
        border-radius: .5rem;
        padding: .75rem;

        & > span {
            display: flex;
            flex-direction: column;
            gap: var(--gap-small);
            position: sticky;
            top: 5rem;
            
            & > h2 {
                padding: 0;
                margin: 0;
                opacity: 75%;
                font-size: 1em;
                color: var(--background-200);
            }
            & > :global(a) {
                background-color: transparent;
                padding: .5rem;
                border-radius: .25rem;
                transition: background-color, color;
                transition-duration: var(--transition-duration);
            }
            // For some reason doing a nested &:global(.scrolled) on the above doesn't work?
            & > :global(a.scrolled) {
                background-color: color-mix(in srgb, var(--text-500) 25%, transparent);
            }
            & > :global(a:hover) {
                background-color: color-mix(in srgb, var(--secondary-500) 25%, transparent);
                color: var(--primary-200);
                text-decoration: none;
            }
        }
    }
    article {
        background-color: color-mix(in srgb, var(--background-950) 50%, transparent);
        border-radius: .5rem;
        padding: .75rem;
        h3 {
            padding: 0;
            margin: 0;
            margin-bottom: .5rem;
            color: var(--accent-300);
        }
        div {
            padding-left: .5rem;
            border-left: .25rem solid color-mix(in srgb, var(--background-500) 75%, transparent);
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
