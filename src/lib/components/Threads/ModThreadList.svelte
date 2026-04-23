<script lang="ts">
    import type { ServerModVersionThreadComment } from "$lib/api/models/mod-version";
    import Column from "../Column.svelte";
    import ModThreadComment from "./ModThreadComment.svelte";

    interface Props {
        comments: ServerModVersionThreadComment[];
    }

    const { comments }: Props = $props();
</script>

<Column align="start">
    {#if comments.length > 0}
        {#each comments as comment (comment.id)}
            <ModThreadComment {comment} />
        {/each}
    {:else}
    <p>No comments here yet...</p>
    {/if}
</Column>
