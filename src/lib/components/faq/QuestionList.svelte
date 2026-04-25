<script lang="ts">
    import type { Faq } from "$lib/types/faq";
    import QuestionListItem from "./QuestionListItem.svelte";

    interface Props {
        faqs: Faq[];
    }

    const { faqs }: Props = $props();
</script>

<div>
    {#each faqs as faq}
        <section class="not-last:mb-6">
            <h2 class="text-text-50 my-2 text-3xl group-first:mt-0">{faq.category}</h2>
            {#each faq.questions as question (question.id)}
                <div class="mb-2">
                    <QuestionListItem
                        {question}
                        alert={faq.category === "new-gd-update-geode-broken" ||
                            faq.category === "new-gd-update-geode-released"} />
                </div>
            {/each}
        </section>
    {/each}
</div>
