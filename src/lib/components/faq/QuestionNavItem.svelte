<script lang="ts">
    import type { Faq } from "$lib/types/faq";
    import { onMount } from "svelte";
    import { smoothScrollToElement } from "$lib/smooth-scroll";
    import { idText } from "typescript";
    import Card from "../Card.svelte";

    interface Props {
        faq: Faq;
    }

    const { faq }: Props = $props();

    const smoothScroll = (e: MouseEvent): void => {
        e.preventDefault();
        const a = e.currentTarget! as HTMLAnchorElement;

        const hash = a.getAttribute("href") ?? "";

        const target = document.querySelector(hash);
        if (!target) {
            return;
        }

        smoothScrollToElement(target as HTMLElement);
        const url = new URL(window.location.href);
        url.hash = hash;
    };
</script>

<Card semitransparent class="bg-background-300/10">
    <div class="group">
        <h2 class="text-accent-300 my-2 text-xl group-first:mt-0">{faq.category}</h2>
        <ul>
            {#each faq.questions as { id, question } (id)}
                <li class="my-1">
                    <a
                        id={`faq-nav-link-${id}`}
                        class="hover:bg-primary-300/50 hover:border-primary-300/50 block cursor-pointer rounded-md border-3 border-transparent p-1 transition hover:border-solid"
                        href={`#${id}`}
                        onclick={(e) => smoothScroll(e)}>
                        {question}
                    </a>
                </li>
            {/each}
        </ul>
    </div>
</Card>
