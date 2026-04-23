<script lang="ts">
    import type { ServerModVersion, ServerModVersionThreadComment } from "$lib/api/models/mod-version";
    import Button from "../Button.svelte";
    import Column from "../Column.svelte";
    import ModThreadList from "./ModThreadList.svelte";

    interface Props {
        mod_version: ServerModVersion;
        initial_comments: ServerModVersionThreadComment[];
    }

    let { mod_version, initial_comments }: Props = $props();

    // svelte-ignore state_referenced_locally
    const comments = $state(initial_comments);
</script>

<Column align="start">
    <div>
        <form id="mod-thread-new-comment-form" action="">
            <div>
                <textarea name="comment" id="mod-thread-comment" placeholder="Enter your new comment here"></textarea>
            </div>
            <Button>Post</Button>
        </form>
    </div>
    <ModThreadList {comments} />
</Column>
