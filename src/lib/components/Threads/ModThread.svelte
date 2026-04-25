<script lang="ts">
    import type { ServerModVersion, ServerModVersionThreadComment } from "$lib/api/models/mod-version";
    import Button from "../Button.svelte";
    import Column from "../Column.svelte";
    import ModThreadList from "./ModThreadList.svelte";
    import ModThreadCommentForm from "./ModThreadCommentForm.svelte";

    interface Props {
        mod_version: ServerModVersion;
        initial_comments: ServerModVersionThreadComment[];
    }

    let { mod_version, initial_comments }: Props = $props();

    // svelte-ignore state_referenced_locally
    let comments = $state(initial_comments);
</script>

<div class="flex flex-col gap-2">
    <ModThreadCommentForm />
    <ModThreadList {comments} />
</div>
