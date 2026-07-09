<script lang="ts">
    import { enhance } from "$app/forms";
    import type { SubmitFunction } from "@sveltejs/kit";
    import { serverTimestampToAgoString } from "$lib";
    import { type ServerModVersionThreadComment, type ServerModVersionThreadLock } from "$lib/api/models/mod-version";
    import { getUserContext } from "$lib/context/user";
    import DevRoleChip from "../DevRoleChip.svelte";
    import Link from "../Link.svelte";
    import Button from "../Button.svelte";
    import Icon from "../Icon.svelte";
    import Textarea from "../ui/Textarea.svelte";
    import FileInput from "../ui/FileInput.svelte";
    import InfoBox from "../InfoBox.svelte";

    interface Props {
        comment: ServerModVersionThreadComment;
        version: string;
        lock: ServerModVersionThreadLock;
    }

    let { comment, version, lock }: Props = $props();

    const displayedComment = $derived(() => comment.comment.replaceAll('\n', '<br>'));

    const currentUser = $derived(getUserContext());
    const isAdmin = $derived(currentUser?.admin === true);
    const isAuthor = $derived(comment.author.id === currentUser?.id);
    const canModify = $derived(isAdmin || (isAuthor && lock !== "locked"));

    let editing = $state(false);
    let confirmingDelete = $state(false);
    let confirmingDeleteAttachmentId: number | null = $state(null);
    let error: string | null = $state(null);
    let submitting = $state(false);

    function submitHandler(failMessage: string, opts?: { onSuccess?: () => void; onFailure?: () => void }): SubmitFunction {
        return () => {
            submitting = true;
            return async ({ result, update }) => {
                submitting = false;
                if (result.type === "failure") {
                    error = (result.data?.error as string) ?? failMessage;
                    opts?.onFailure?.();
                } else {
                    error = null;
                    opts?.onSuccess?.();
                    await update();
                }
            };
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
                <small class="text-text-400 cursor-default" title={new Date(comment.created_at).toLocaleString()}>
                    &bull; {serverTimestampToAgoString(comment.created_at)}
                </small>
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
                            <Button
                                type="submit"
                                size="small"
                                design="primary-filled"
                                disabled={submitting}
                                title="Save changes to this comment">
                                <Icon icon="confirm" />
                                Save
                            </Button>
                            <Button
                                type="button"
                                size="small"
                                design="hollow"
                                disabled={submitting}
                                title="Discard changes"
                                onclick={() => {
                                    editing = false;
                                    error = null;
                                }}>
                                <Icon icon="cancel" />
                                Cancel
                            </Button>
                        </div>
                    </form>
                {:else}
                    <div class="max-w-96 text-wrap break-all">
                        {@html displayedComment()}
                    </div>
                {/if}

                {#if comment.attachments.length > 0}
                    <div class="flex flex-wrap gap-2 pt-1">
                        {#each comment.attachments as att (att.id)}
                            <div class="relative">
                                <a href={att.url} target="_blank" rel="noopener noreferrer">
                                    <img src={att.url} alt="attachment" class="max-h-32 rounded" />
                                </a>
                                {#if canModify}
                                    {#if confirmingDeleteAttachmentId === att.id}
                                        <form
                                            method="POST"
                                            action="?/delete_attachment"
                                            class="bg-background-950 absolute top-1 right-1 flex items-center gap-1 rounded px-1"
                                            use:enhance={submitHandler("Failed to remove attachment", {
                                                onFailure: () => (confirmingDeleteAttachmentId = null),
                                            })}>
                                            <input type="hidden" name="version" value={version} />
                                            <input type="hidden" name="comment_id" value={comment.id} />
                                            <input type="hidden" name="attachment_id" value={att.id} />
                                            <button
                                                type="submit"
                                                class="text-sm text-red-300 cursor-pointer"
                                                disabled={submitting}
                                                title="Confirm delete">Yes</button>
                                            <button
                                                type="button"
                                                class="text-text-400 text-sm cursor-pointer"
                                                title="Cancel delete"
                                                onclick={() => (confirmingDeleteAttachmentId = null)}>No</button>
                                        </form>
                                    {:else}
                                        <button
                                            type="button"
                                            class="bg-background-950 cursor-pointer absolute top-1 right-1 rounded px-2 text-red-300"
                                            aria-label="remove attachment"
                                            title="Remove attachment"
                                            onclick={() => (confirmingDeleteAttachmentId = att.id)}>✕</button>
                                    {/if}
                                {/if}
                            </div>
                        {/each}
                    </div>
                {/if}

                {#if canModify && !editing}
                    <div class="flex items-center gap-2 pt-2">
                        {#if isAuthor}
                            <form
                                method="POST"
                                action="?/add_attachment"
                                enctype="multipart/form-data"
                                class="flex items-center gap-2"
                                use:enhance={submitHandler("Failed to upload attachment")}>
                                <input type="hidden" name="version" value={version} />
                                <input type="hidden" name="comment_id" value={comment.id} />
                                <FileInput
                                    id={`mod-thread-comment-attachment-${comment.id}`}
                                    name="files"
                                    accept="image/*"
                                    multiple
                                    size="small" />
                                <Button
                                    type="submit"
                                    size="small"
                                    design="hollow"
                                    disabled={submitting}
                                    title="Upload selected files as attachments">
                                    <Icon icon="update" />
                                    Attach
                                </Button>
                            </form>
                            <div class="bg-background-300 h-6 w-px"></div>
                            <Button
                                type="button"
                                size="small"
                                design="hollow"
                                title="Edit comment"
                                aria-label="Edit comment"
                                onclick={() => (editing = true)}>
                                <Icon icon="modify" />
                            </Button>
                        {/if}
                        {#if confirmingDelete}
                            <form
                                method="POST"
                                action="?/delete_comment"
                                class="inline-flex items-center"
                                use:enhance={submitHandler("Failed to delete comment", {
                                    onFailure: () => (confirmingDelete = false),
                                })}>
                                <input type="hidden" name="version" value={version} />
                                <input type="hidden" name="comment_id" value={comment.id} />
                                <Button
                                    type="submit"
                                    size="small"
                                    design="hollow"
                                    class="rounded-r-none border-red-300 text-red-300 hover:border-red-50 hover:bg-red-50 hover:text-red-950"
                                    disabled={submitting}
                                    title="Confirm delete"
                                    aria-label="Confirm delete">
                                    <Icon icon="confirm" />
                                </Button>
                                <Button
                                    type="button"
                                    size="small"
                                    design="hollow"
                                    class="rounded-l-none border-l-0"
                                    title="Cancel delete"
                                    aria-label="Cancel delete"
                                    onclick={() => (confirmingDelete = false)}>
                                    <Icon icon="cancel" />
                                </Button>
                            </form>
                        {:else}
                            <Button
                                type="button"
                                size="small"
                                design="hollow"
                                class="border-red-300 text-red-300 hover:border-red-50 hover:bg-red-50 hover:text-red-950"
                                title="Delete comment"
                                aria-label="Delete comment"
                                onclick={() => (confirmingDelete = true)}>
                                <Icon icon="delete" />
                            </Button>
                        {/if}
                    </div>
                {/if}

                {#if error}
                    <InfoBox type="error">{error}</InfoBox>
                {/if}
            </div>
        </div>
    </div>
</div>
