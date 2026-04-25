<script lang="ts">
    import type { Faq } from "$lib/types/faq";
    import Card from "../Card.svelte";
    import QuestionNavItem from "./QuestionNavItem.svelte";

    interface Props {
        faqs: Faq[];
    }

    const { faqs }: Props = $props();
</script>

<Card semitransparent>
    <nav class="hidden flex-col md:flex gap-2">
        {#each faqs as faq (faq.id)}
            <QuestionNavItem {faq} />
        {/each}
    </nav>
</Card>
