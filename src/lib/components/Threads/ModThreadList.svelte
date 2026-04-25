<script lang="ts">
    import type { ServerModVersionThreadComment } from "$lib/api/models/mod-version";
    import ModThreadComment from "./ModThreadComment.svelte";

    interface Props {
        comments: ServerModVersionThreadComment[];
    }

    let { comments }: Props = $props();
</script>

<div class="flex flex-col gap-3">
    {#each comments as comment (comment.id)}
        <div class="pb-3 border-b-2 border-solid border-background-800">
            <ModThreadComment {comment} />
        </div>
    {/each}
</div>
