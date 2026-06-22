<script lang="ts">
    import { enhance } from "$app/forms";
    import type { SubmitFunction } from "@sveltejs/kit";
    import { serverTimestampToAgoString } from "$lib";
    import { type ServerModVersionThreadComment } from "$lib/api/models/mod-version";
    import { getUserContext } from "$lib/context/user";
    import DevRoleChip from "../DevRoleChip.svelte";
    import Link from "../Link.svelte";
    import Button from "../Button.svelte";
    import Icon from "../Icon.svelte";
    import Textarea from "../ui/Textarea.svelte";
    import InfoBox from "../InfoBox.svelte";

    interface Props {
        comment: ServerModVersionThreadComment;
        version: string;
    }

    let { comment, version }: Props = $props();

    const currentUser = getUserContext();
    const isAdmin = $derived(currentUser?.admin === true);
    const isAuthor = $derived(comment.author.id === currentUser?.id);

    let editing = $state(false);
    let confirmingDelete = $state(false);
    let error: string | null = $state(null);

    function submitHandler(failMessage: string, opts?: { onSuccess?: () => void; onFailure?: () => void }): SubmitFunction {
        return () =>
            async ({ result, update }) => {
                if (result.type === "failure") {
                    error = (result.data?.error as string) ?? failMessage;
                    opts?.onFailure?.();
                } else {
                    error = null;
                    opts?.onSuccess?.();
                    await update();
                }
            };
    }
</script>

<div>
    <div class="flex items-start gap-2">
        <enhanced:img
            src={`https://avatars.githubusercontent.com/u/${comment.author.github_id}`}
            class="rounded"
            width="50"
            height="50"
            alt={`developer ${comment.author.display_name}`} />
        <div class="flex w-full flex-col gap-2">
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
                {#if editing}
                    <form
                        method="POST"
                        action="?/edit_comment"
                        class="flex flex-col gap-2"
                        use:enhance={submitHandler("Failed to edit comment", { onSuccess: () => (editing = false) })}>
                        <input type="hidden" name="version" value={version} />
                        <input type="hidden" name="comment_id" value={comment.id} />
                        <Textarea name="comment" class="min-h-20" value={comment.comment} />
                        <div class="flex gap-2">
                            <Button type="submit" size="small" design="primary-filled">Save</Button>
                            <Button
                                type="button"
                                size="small"
                                design="hollow"
                                onclick={() => {
                                    editing = false;
                                    error = null;
                                }}>Cancel</Button>
                        </div>
                    </form>
                {:else}
                    <div class="max-w-96 text-wrap break-all">{comment.comment}</div>
                {/if}

                {#if comment.attachments.length > 0}
                    <div class="flex flex-wrap gap-2 pt-1">
                        {#each comment.attachments as att (att.id)}
                            <div class="relative">
                                <a href={att.url} target="_blank" rel="noopener noreferrer">
                                    <img src={att.url} alt="attachment" class="max-h-32 rounded" />
                                </a>
                                {#if isAuthor || isAdmin}
                                    <form
                                        method="POST"
                                        action="?/delete_attachment"
                                        class="absolute top-1 right-1"
                                        use:enhance={submitHandler("Failed to remove attachment")}>
                                        <input type="hidden" name="version" value={version} />
                                        <input type="hidden" name="comment_id" value={comment.id} />
                                        <input type="hidden" name="attachment_id" value={att.id} />
                                        <button type="submit" class="bg-background-950 rounded px-1 text-red-300" aria-label="remove attachment">✕</button>
                                    </form>
                                {/if}
                            </div>
                        {/each}
                    </div>
                {/if}

                <div class="flex items-center gap-4">
                    <small class="text-text-400">
                        {serverTimestampToAgoString(comment.created_at)}
                    </small>
                    {#if isAuthor && !editing}
                        <button class="text-text-400 text-sm" type="button" onclick={() => (editing = true)}
                            >Edit</button>
                    {/if}
                    {#if isAuthor || isAdmin}
                        {#if confirmingDelete}
                            <form
                                method="POST"
                                action="?/delete_comment"
                                class="inline-flex items-center gap-2"
                                use:enhance={submitHandler("Failed to delete comment", {
                                    onFailure: () => (confirmingDelete = false),
                                })}>
                                <input type="hidden" name="version" value={version} />
                                <input type="hidden" name="comment_id" value={comment.id} />
                                <small class="text-red-300">Confirm?</small>
                                <button class="text-sm text-red-300" type="submit">Yes</button>
                                <button
                                    class="text-text-400 text-sm"
                                    type="button"
                                    onclick={() => (confirmingDelete = false)}>No</button>
                            </form>
                        {:else}
                            <button class="text-sm text-red-300" type="button" onclick={() => (confirmingDelete = true)}
                                >Delete</button>
                        {/if}
                    {/if}
                </div>

                {#if isAuthor || isAdmin}
                    <form
                        method="POST"
                        action="?/add_attachment"
                        enctype="multipart/form-data"
                        class="flex items-center gap-2 pt-1"
                        use:enhance={submitHandler("Failed to upload attachment")}>
                        <input type="hidden" name="version" value={version} />
                        <input type="hidden" name="comment_id" value={comment.id} />
                        <input type="file" name="files" accept="image/*" multiple />
                        <Button type="submit" size="small" design="hollow">
                            <Icon icon="update" />
                            Attach
                        </Button>
                    </form>
                {/if}

                {#if error}
                    <InfoBox type="error">{error}</InfoBox>
                {/if}
            </div>
        </div>
    </div>
</div>
