<script lang="ts">
    import { serverTimestampToAgoString } from "$lib";
    import { type ServerModVersionThreadComment } from "$lib/api/models/mod-version";
    import DevRoleChip from "../DevRoleChip.svelte";
    import Link from "../Link.svelte";

    interface Props {
        comment: ServerModVersionThreadComment;
    }

    let { comment }: Props = $props();
</script>

<div>
    <div class="flex items-start gap-2">
        <enhanced:img
            src={`https://avatars.githubusercontent.com/u/${comment.author.github_id}`}
            class="rounded"
            width="50"
            height="50"
            alt={`developer ${comment.author.display_name}`} />
        <div class="flex flex-col gap-2">
            <div class="flex items-center gap-2">
                <span class="text-accent-300">
                    <Link href={`/developers/${comment.author.id}`}>{comment.author.display_name}</Link>
                </span>
                {#if comment.author.admin}
                    <DevRoleChip type="admin" iconOnly />
                {/if}
                {#if comment.author.verified}
                    <DevRoleChip type="verified" iconOnly />
                {/if}
            </div>
            <div class="flex flex-col gap-1">
                <div class="max-w-96 text-wrap break-all">{comment.comment}</div>
                <small class="text-text-400">
                    {serverTimestampToAgoString(comment.created_at)}
                </small>
            </div>
        </div>
    </div>
</div>
