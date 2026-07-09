<script lang="ts">
    import type { ServerModVersionThreadComment, ServerModVersionThreadLock } from "$lib/api/models/mod-version";
    import type { Paginated } from "$lib/api/index-repository";
    import ModThreadComment from "./ModThreadComment.svelte";
    import Pagination from "../Pagination.svelte";

    interface Props {
        comments: Paginated<ServerModVersionThreadComment>;
        version: string;
        lock: ServerModVersionThreadLock;
        page: number;
        perPage: number;
        onChangePage: (page: number) => void;
    }

    let { comments, version, lock, page, perPage, onChangePage }: Props = $props();
</script>

<div class="flex flex-col gap-3">
    <Pagination
        label="comments"
        labelOne="comment"
        {perPage}
        total={comments.count}
        pageCount={comments.data.length}
        {page}
        select={onChangePage} />
    {#each comments.data as comment (comment.id)}
        <div class="border-background-800 border-b-2 border-solid pb-3">
            <ModThreadComment {comment} {version} {lock} />
        </div>
    {/each}
</div>
