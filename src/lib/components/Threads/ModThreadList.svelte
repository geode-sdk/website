<script lang="ts">
    import type { ServerModVersionThreadComment } from "$lib/api/models/mod-version";
    import ModThreadComment from "./ModThreadComment.svelte";

    interface Props {
        comments: ServerModVersionThreadComment[];
        version: string;
    }

    let { comments, version }: Props = $props();
</script>

<div class="flex flex-col gap-3">
    {#each comments as comment (comment.id)}
        <div class="border-background-800 border-b-2 border-solid pb-3">
            <ModThreadComment {comment} {version} />
        </div>
    {/each}
</div>
