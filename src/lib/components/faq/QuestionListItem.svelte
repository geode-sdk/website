<script lang="ts">
    import type { FaqQuestion } from "$lib/types/faq";
    import Markdown from "svelte-exmarkdown";
    import Card from "../Card.svelte";
    import { getNewGDUpdateWasReleased } from "$lib";
    import cx from "$lib/cx";

    interface Props {
        question: FaqQuestion;
        alert?: boolean;
    }

    const newGDUpdate = getNewGDUpdateWasReleased();

    const { question, alert }: Props = $props();
    const md = $derived(question.answer.replace(/{RECENT_GD_UPDATE_VERSION}/g, newGDUpdate?.newGDVersion ?? "(N/A)"));
</script>

<div id={question.id} class="group">
    <Card
        semitransparent
        class={cx("group-[.highlight-scrolled]:bg-secondary-700/80 transition", alert && "bg-primary-900/60")}>
        <h3 class="text-accent-300 text-2xl">{question.question}</h3>
        <div
            class="markdown border-l-background-700 group-[.highlight-scrolled]:border-l-primary-300 border-l-4 border-solid pl-2">
            <Markdown {md} />
        </div>
    </Card>
</div>
